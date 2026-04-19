import './UploadPage.css';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  Suspense,
  useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import * as THREE from 'three';
import JSZip from 'jszip';
import axios from 'axios';
import { createModel } from '../../api/modelsApi';
import type { ViewerConfig } from '../../types';

const MODEL_EXTENSIONS = ['fbx', 'zip'] as const;
const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg'] as const;
type ModelExt = (typeof MODEL_EXTENSIONS)[number];

function getExtension(name: string): string {
  return /\.([a-zA-Z0-9]+)$/.exec(name)?.[1]?.toLowerCase() ?? '';
}

interface ZipExtract {
  fbxUrl: string;
  fbxName: string;
  textures: { name: string; url: string }[];
}

async function extractZip(file: File): Promise<ZipExtract | null> {
  const zip = await JSZip.loadAsync(file);
  let fbxUrl: string | null = null;
  let fbxName: string | null = null;
  const textures: { name: string; url: string }[] = [];

  for (const entry of Object.values(zip.files)) {
    if (entry.dir) continue;
    const base = entry.name.split(/[\\/]/).pop() ?? entry.name;
    const ext = getExtension(base);
    if (ext === 'fbx' && !fbxUrl) {
      const blob = await entry.async('blob');
      fbxUrl = URL.createObjectURL(blob);
      fbxName = base;
    } else if ((IMAGE_EXTENSIONS as readonly string[]).includes(ext)) {
      const blob = await entry.async('blob');
      textures.push({ name: base, url: URL.createObjectURL(blob) });
    }
  }

  if (!fbxUrl || !fbxName) return null;
  return { fbxUrl, fbxName, textures };
}

type EditableMaterial = THREE.Material & {
  color?: THREE.Color;
  map?: THREE.Texture | null;
};

interface MaterialSlot {
  key: string;
  meshName: string;
  materialName: string;
  material: EditableMaterial;
}

function collectMaterials(root: THREE.Object3D): MaterialSlot[] {
  const out: MaterialSlot[] = [];
  let meshIdx = 0;
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach((m, j) => {
      out.push({
        key: `${meshIdx}-${j}`,
        meshName: mesh.name || `Mesh ${meshIdx}`,
        materialName: m.name || `Material ${j}`,
        material: m as EditableMaterial,
      });
    });
    meshIdx++;
  });
  return out;
}

function FBXScene({
  url,
  textureMap,
  onReady,
}: {
  url: string;
  textureMap: Map<string, string>;
  onReady: (root: THREE.Group) => void;
}) {
  const obj = useLoader(FBXLoader, url, (loader) => {
    loader.manager.setURLModifier((u) => {
      const base = (u.split(/[\\/]/).pop() ?? u).toLowerCase();
      return textureMap.get(base) ?? u;
    });
  });

  useEffect(() => {
    onReady(obj as unknown as THREE.Group);
  }, [obj, onReady]);

  return <primitive object={obj} scale={0.01} />;
}

export default function UploadPage() {
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [fileError, setFileError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [fbxUrl, setFbxUrl] = useState<string | null>(null);
  const [fbxName, setFbxName] = useState<string | null>(null);
  const [zipTextures, setZipTextures] = useState<{ name: string; url: string }[]>([]);
  const [materials, setMaterials] = useState<MaterialSlot[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [, forceTick] = useState(0);

  const [background, setBackground] = useState('#111317');
  const [ambientIntensity, setAmbientIntensity] = useState(0.6);
  const [directionalIntensity, setDirectionalIntensity] = useState(1);

  const materialOverridesRef = useRef<
    Record<string, { color?: string; textureName?: string }>
  >({});
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!modelFile) {
      setFbxUrl(null);
      setFbxName(null);
      setZipTextures([]);
      setMaterials([]);
      setSelectedKey(null);
      materialOverridesRef.current = {};
      return;
    }
    const ext = getExtension(modelFile.name);
    let cancelled = false;
    const revokeFns: (() => void)[] = [];

    (async () => {
      if (ext === 'fbx') {
        const url = URL.createObjectURL(modelFile);
        revokeFns.push(() => URL.revokeObjectURL(url));
        if (cancelled) return;
        setFbxUrl(url);
        setFbxName(modelFile.name);
        setZipTextures([]);
      } else if (ext === 'zip') {
        const extracted = await extractZip(modelFile);
        if (cancelled) {
          extracted?.textures.forEach((t) => URL.revokeObjectURL(t.url));
          if (extracted) URL.revokeObjectURL(extracted.fbxUrl);
          return;
        }
        if (!extracted) {
          setFileError('В архиве не найдена .fbx модель');
          setModelFile(null);
          return;
        }
        revokeFns.push(() => URL.revokeObjectURL(extracted.fbxUrl));
        extracted.textures.forEach((t) =>
          revokeFns.push(() => URL.revokeObjectURL(t.url))
        );
        setFbxUrl(extracted.fbxUrl);
        setFbxName(extracted.fbxName);
        setZipTextures(extracted.textures);
      }
    })();

    return () => {
      cancelled = true;
      revokeFns.forEach((fn) => fn());
    };
  }, [modelFile]);

  const textureMap = useMemo(() => {
    const m = new Map<string, string>();
    zipTextures.forEach((t) => m.set(t.name.toLowerCase(), t.url));
    return m;
  }, [zipTextures]);

  const handleFbxReady = useCallback((root: THREE.Group) => {
    const slots = collectMaterials(root);
    setMaterials(slots);
    setSelectedKey((prev) => prev ?? slots[0]?.key ?? null);
  }, []);

  const selectedSlot = materials.find((m) => m.key === selectedKey) ?? null;

  const handleColorChange = (hex: string) => {
    if (!selectedSlot?.material.color) return;
    selectedSlot.material.color.set(hex);
    selectedSlot.material.needsUpdate = true;
    const prev = materialOverridesRef.current[selectedSlot.key] ?? {};
    materialOverridesRef.current[selectedSlot.key] = { ...prev, color: hex };
    forceTick((t) => t + 1);
  };

  const handleTextureChange = (textureName: string) => {
    if (!selectedSlot) return;
    const mat = selectedSlot.material;
    const prev = materialOverridesRef.current[selectedSlot.key] ?? {};
    if (!textureName) {
      if (mat.map) {
        mat.map.dispose();
        mat.map = null;
      }
      mat.needsUpdate = true;
      materialOverridesRef.current[selectedSlot.key] = {
        ...prev,
        textureName: undefined,
      };
      forceTick((t) => t + 1);
      return;
    }
    const tex = zipTextures.find((t) => t.name === textureName);
    if (!tex) return;
    new THREE.TextureLoader().load(tex.url, (loaded) => {
      loaded.flipY = false;
      loaded.colorSpace = THREE.SRGBColorSpace;
      loaded.name = textureName;
      if (mat.map) mat.map.dispose();
      mat.map = loaded;
      mat.needsUpdate = true;
      materialOverridesRef.current[selectedSlot.key] = {
        ...prev,
        textureName,
      };
      forceTick((t) => t + 1);
    });
  };

  const handleModelPick = (file: File | null) => {
    setFileError('');
    if (!file) {
      setModelFile(null);
      return;
    }
    const ext = getExtension(file.name);
    if (!MODEL_EXTENSIONS.includes(ext as ModelExt)) {
      setFileError('Поддерживаются только .fbx или .zip');
      return;
    }
    setModelFile(file);
  };

  const resetModel = () => {
    setModelFile(null);
    setImageFile(null);
    setTitle('');
    setFileError('');
    materialOverridesRef.current = {};
  };

  const buildViewerConfig = (): ViewerConfig => {
    const controls = controlsRef.current;
    const cam = controls?.object as THREE.PerspectiveCamera | undefined;
    const target = controls?.target;
    return {
      camera: {
        position: cam
          ? [cam.position.x, cam.position.y, cam.position.z]
          : [0, 1, 3],
        target: target ? [target.x, target.y, target.z] : [0, 0, 0],
        fov: cam?.fov ?? 50,
      },
      background,
      ambientIntensity,
      directionalIntensity,
      directionalPosition: [5, 5, 5],
      materials: materialOverridesRef.current,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelFile || !imageFile || !title) return;

    const imgExt = getExtension(imageFile.name);
    if (!(IMAGE_EXTENSIONS as readonly string[]).includes(imgExt)) {
      alert('Изображение должно быть .png или .jpeg');
      return;
    }

    setSubmitting(true);
    try {
      const config = buildViewerConfig();
      const configJson = JSON.stringify(config);
      const uploadUrl = await createModel(title, modelFile.name, configJson);
      await axios.put(uploadUrl, modelFile, {
        headers: { 'Content-Type': 'application/octet-stream' },
      });
      navigate('/');
    } catch (error) {
      console.error('Ошибка при загрузке:', error);
      alert('Не удалось загрузить модель');
    } finally {
      setSubmitting(false);
    }
  };

  if (!modelFile) {
    return (
      <main className="upload-stage-picker">
        <h1 className="upload-title">Загрузить модель</h1>
        <label className="upload-dropzone">
          <input
            type="file"
            accept=".fbx,.zip"
            onChange={(e) => handleModelPick(e.target.files?.[0] ?? null)}
          />
          <div className="upload-dropzone-icon">+</div>
          <div className="upload-dropzone-title">
            Выберите модель (.fbx) или архив (.zip)
          </div>
          <div className="upload-dropzone-hint">
            Редактор откроется после выбора файла
          </div>
        </label>
        {fileError && <div className="upload-file-error">{fileError}</div>}
        <button
          type="button"
          className="upload-cancel-link"
          onClick={() => navigate('/')}
        >
          Отмена
        </button>
      </main>
    );
  }

  const currentColor =
    selectedSlot?.material.color != null
      ? `#${selectedSlot.material.color.getHexString()}`
      : '#ffffff';
  const currentTextureName = selectedSlot?.material.map?.name ?? '';

  return (
    <main className="editor-fullscreen">
      <div className="editor-topbar">
        <div className="editor-topbar-info">
          <span className="editor-topbar-label">Файл:</span>
          <span className="editor-topbar-name">{fbxName ?? modelFile.name}</span>
          {zipTextures.length > 0 && (
            <span className="editor-topbar-badge">
              {zipTextures.length} текстур
            </span>
          )}
        </div>
        <button type="button" className="editor-change" onClick={resetModel}>
          Сменить файл
        </button>
      </div>

      <div className="editor-fullscreen-body">
        <div className="editor-viewer" style={{ background }}>
          {fbxUrl && (
            <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
              <color attach="background" args={[background]} />
              <ambientLight intensity={ambientIntensity} />
              <directionalLight position={[5, 5, 5]} intensity={directionalIntensity} />
              <directionalLight position={[-5, 3, -5]} intensity={0.4} />
              <OrbitControls ref={controlsRef} />
              <Suspense fallback={null}>
                <FBXScene
                  url={fbxUrl}
                  textureMap={textureMap}
                  onReady={handleFbxReady}
                />
              </Suspense>
            </Canvas>
          )}
        </div>

        <aside className="editor-panel">
          <section className="editor-panel-section">
            <h3 className="editor-panel-title">Сцена</h3>
            <div className="editor-color-row">
              <label className="editor-inline-label">Фон</label>
              <input
                type="color"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="editor-color-input"
              />
              <code className="editor-color-hex">{background}</code>
            </div>
            <div className="editor-range-row">
              <label className="editor-inline-label">
                Ambient {ambientIntensity.toFixed(2)}
              </label>
              <input
                type="range"
                min={0}
                max={2}
                step={0.05}
                value={ambientIntensity}
                onChange={(e) => setAmbientIntensity(Number(e.target.value))}
              />
            </div>
            <div className="editor-range-row">
              <label className="editor-inline-label">
                Directional {directionalIntensity.toFixed(2)}
              </label>
              <input
                type="range"
                min={0}
                max={3}
                step={0.05}
                value={directionalIntensity}
                onChange={(e) => setDirectionalIntensity(Number(e.target.value))}
              />
            </div>
          </section>

          <section className="editor-panel-section">
            <h3 className="editor-panel-title">Материалы</h3>
            {materials.length === 0 ? (
              <div className="editor-panel-muted">Загрузка...</div>
            ) : (
              <ul className="material-list">
                {materials.map((m) => {
                  const swatch = m.material.color
                    ? `#${m.material.color.getHexString()}`
                    : '#cccccc';
                  return (
                    <li key={m.key}>
                      <button
                        type="button"
                        className={`material-item${
                          m.key === selectedKey ? ' selected' : ''
                        }`}
                        onClick={() => setSelectedKey(m.key)}
                      >
                        <span
                          className="material-item-swatch"
                          style={{ backgroundColor: swatch }}
                        />
                        <span className="material-item-text">
                          <span className="material-item-name">
                            {m.materialName}
                          </span>
                          <span className="material-item-sub">{m.meshName}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {selectedSlot && (
            <>
              <section className="editor-panel-section">
                <h3 className="editor-panel-title">Base color</h3>
                <div className="editor-color-row">
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="editor-color-input"
                  />
                  <code className="editor-color-hex">{currentColor}</code>
                </div>
              </section>

              <section className="editor-panel-section">
                <h3 className="editor-panel-title">Текстура</h3>
                {zipTextures.length === 0 ? (
                  <div className="editor-panel-muted">
                    Загрузите .zip с текстурами рядом с .fbx, чтобы применять их
                  </div>
                ) : (
                  <select
                    value={currentTextureName}
                    onChange={(e) => handleTextureChange(e.target.value)}
                    className="editor-select"
                  >
                    <option value="">— без текстуры —</option>
                    {zipTextures.map((t) => (
                      <option key={t.url} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                )}
              </section>
            </>
          )}

          <form onSubmit={handleSubmit} className="editor-panel-form">
            <label className="editor-field">
              <span>Название</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Введите название"
                required
              />
            </label>

            <div className="editor-field">
              <span>Превью (.png, .jpeg)</span>
              <label className="file-upload">
                <input
                  type="file"
                  accept=".png,.jpeg,.jpg"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  required
                />
                <span className="file-button">
                  {imageFile ? imageFile.name : 'Выберите файл'}
                </span>
              </label>
            </div>

            <div className="actions">
              <button
                type="submit"
                className="send-button"
                disabled={submitting || !imageFile || !title}
              >
                {submitting ? 'Загрузка...' : 'Сохранить'}
              </button>
              <button
                type="button"
                className="send-button cancel"
                onClick={() => navigate('/')}
                disabled={submitting}
              >
                Отмена
              </button>
            </div>
          </form>
        </aside>
      </div>
    </main>
  );
}
