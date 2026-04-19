import './ModelPage.css';
import { Suspense, useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import * as THREE from 'three';
import JSZip from 'jszip';
import { getModel } from '../../api/modelsApi';
import {
  getLikeState,
  toggleLike,
  getComments,
  addComment,
  deleteComment,
} from '../../api/interactionsApi';
import { useAuth } from '../../features/auth/AuthContext';
import LoginModal from '../../features/auth/LoginModal';
import type { Model, Comment, ViewerConfig } from '../../types';

function parseConfig(raw?: string | null): ViewerConfig | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ViewerConfig;
  } catch {
    return null;
  }
}

async function prepareFromZip(
  url: string
): Promise<{ fbxUrl: string; textureMap: Map<string, string>; revoke: () => void } | null> {
  const resp = await fetch(url);
  if (!resp.ok) return null;
  const blob = await resp.blob();
  const zip = await JSZip.loadAsync(blob);
  let fbxUrl: string | null = null;
  const textureMap = new Map<string, string>();
  const urls: string[] = [];

  for (const entry of Object.values(zip.files)) {
    if (entry.dir) continue;
    const base = (entry.name.split(/[\\/]/).pop() ?? entry.name).toLowerCase();
    const ext = /\.([a-zA-Z0-9]+)$/.exec(base)?.[1] ?? '';
    if (ext === 'fbx' && !fbxUrl) {
      const b = await entry.async('blob');
      fbxUrl = URL.createObjectURL(b);
      urls.push(fbxUrl);
    } else if (['png', 'jpg', 'jpeg'].includes(ext)) {
      const b = await entry.async('blob');
      const u = URL.createObjectURL(b);
      textureMap.set(base, u);
      urls.push(u);
    }
  }

  if (!fbxUrl) return null;
  return {
    fbxUrl,
    textureMap,
    revoke: () => urls.forEach((u) => URL.revokeObjectURL(u)),
  };
}

function applyMaterialOverrides(
  root: THREE.Object3D,
  overrides: ViewerConfig['materials'],
  textureMap: Map<string, string>
) {
  let meshIdx = 0;
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach((m, j) => {
      const key = `${meshIdx}-${j}`;
      const ov = overrides[key];
      if (!ov) return;
      const mat = m as THREE.Material & {
        color?: THREE.Color;
        map?: THREE.Texture | null;
        needsUpdate?: boolean;
      };
      if (ov.color && mat.color) mat.color.set(ov.color);
      if (ov.textureName) {
        const texUrl = textureMap.get(ov.textureName.toLowerCase());
        if (texUrl) {
          new THREE.TextureLoader().load(texUrl, (loaded) => {
            loaded.flipY = false;
            loaded.colorSpace = THREE.SRGBColorSpace;
            loaded.name = ov.textureName!;
            if (mat.map) mat.map.dispose();
            mat.map = loaded;
            mat.needsUpdate = true;
          });
        }
      }
      mat.needsUpdate = true;
    });
    meshIdx++;
  });
}

function FBXModel({
  url,
  config,
  textureMap,
}: {
  url: string;
  config: ViewerConfig | null;
  textureMap: Map<string, string>;
}) {
  const fbx = useLoader(FBXLoader, url, (loader) => {
    if (textureMap.size > 0) {
      loader.manager.setURLModifier((u) => {
        const base = (u.split(/[\\/]/).pop() ?? u).toLowerCase();
        return textureMap.get(base) ?? u;
      });
    }
  });

  useEffect(() => {
    if (config?.materials) {
      applyMaterialOverrides(fbx as unknown as THREE.Object3D, config.materials, textureMap);
    }
  }, [fbx, config, textureMap]);

  return <primitive object={fbx} scale={0.01} />;
}

export default function ModelPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);

  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');

  const [showLogin, setShowLogin] = useState(false);

  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [textureMap, setTextureMap] = useState<Map<string, string>>(new Map());
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const config = useMemo(() => parseConfig(model?.viewerConfig), [model?.viewerConfig]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getModel(id)
      .then(setModel)
      .catch((err) => {
        console.error('getModel failed:', err?.response?.status, err?.response?.data, err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const state = getLikeState(id, user?.id ?? null);
    setLikeCount(state.count);
    setLiked(state.liked);
    setComments(getComments(id));
  }, [id, user?.id]);

  useEffect(() => {
    if (!model?.fileUrl) {
      setViewerUrl(null);
      setTextureMap(new Map());
      return;
    }
    const name = (model.modelName ?? '').toLowerCase();
    const isZip = name.endsWith('.zip');
    let cancelled = false;
    let revokeFn: (() => void) | null = null;

    (async () => {
      if (!isZip) {
        setViewerUrl(model.fileUrl);
        setTextureMap(new Map());
        return;
      }
      const prepared = await prepareFromZip(model.fileUrl);
      if (cancelled) {
        prepared?.revoke();
        return;
      }
      if (!prepared) {
        setViewerUrl(null);
        return;
      }
      revokeFn = prepared.revoke;
      setViewerUrl(prepared.fbxUrl);
      setTextureMap(prepared.textureMap);
    })();

    return () => {
      cancelled = true;
      if (revokeFn) revokeFn();
    };
  }, [model?.fileUrl, model?.modelName]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls || !config) return;
    const cam = controls.object as THREE.PerspectiveCamera;
    const [px, py, pz] = config.camera.position;
    cam.position.set(px, py, pz);
    if (config.camera.fov != null && 'fov' in cam) {
      cam.fov = config.camera.fov;
      cam.updateProjectionMatrix();
    }
    const [tx, ty, tz] = config.camera.target;
    controls.target.set(tx, ty, tz);
    controls.update();
  }, [config, viewerUrl]);

  const handleDownload = () => {
    if (!model?.fileUrl) return;
    const link = document.createElement('a');
    link.href = model.fileUrl;
    link.setAttribute('download', model.modelName ?? 'model.fbx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const requireAuth = (): boolean => {
    if (user) return true;
    setShowLogin(true);
    return false;
  };

  const handleLike = () => {
    if (!id || !requireAuth() || !user) return;
    const next = toggleLike(id, user.id);
    setLikeCount(next.count);
    setLiked(next.liked);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !requireAuth() || !user) return;
    const text = commentText.trim();
    if (!text) return;
    addComment(id, user.id, user.nickname, text);
    setComments(getComments(id));
    setCommentText('');
  };

  const handleDeleteComment = (commentId: string) => {
    if (!id || !user) return;
    if (deleteComment(commentId, user.id)) {
      setComments(getComments(id));
    }
  };

  if (loading) {
    return (
      <div className="modelView-page">
        <div className="modelView-status">Загрузка...</div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="modelView-page">
        <div className="modelView-status">Модель не найдена</div>
        <button className="download-button" onClick={() => navigate('/')}>
          На главную
        </button>
      </div>
    );
  }

  const background = config?.background ?? '#111317';
  const ambient = config?.ambientIntensity ?? 0.6;
  const directional = config?.directionalIntensity ?? 1;
  const dirPos: [number, number, number] = config?.directionalPosition ?? [5, 5, 5];
  const camPos: [number, number, number] = config?.camera.position ?? [0, 0, 5];
  const camFov = config?.camera.fov ?? 50;

  return (
    <div className="modelView-page">
      <div className="modelView-card">
        <h1 className="modelView-title">{model.title}</h1>
        <div className="modelView-meta">ID: {model.id}</div>

        <div className="modelView-viewer" style={{ background }}>
          <Canvas camera={{ position: camPos, fov: camFov }}>
            <color attach="background" args={[background]} />
            <ambientLight intensity={ambient} />
            <directionalLight position={dirPos} intensity={directional} />
            <OrbitControls ref={controlsRef} />
            <Suspense fallback={null}>
              {viewerUrl && (
                <FBXModel url={viewerUrl} config={config} textureMap={textureMap} />
              )}
            </Suspense>
          </Canvas>
        </div>

        <div className="modelView-actions">
          <button
            className="download-button"
            onClick={handleDownload}
            disabled={!model.fileUrl}
          >
            Скачать
          </button>
          <button
            className={`like-button${liked ? ' liked' : ''}`}
            onClick={handleLike}
            title={user ? 'Поставить лайк' : 'Войдите, чтобы поставить лайк'}
          >
            <span className="like-icon">{liked ? '♥' : '♡'}</span>
            <span className="like-count">{likeCount}</span>
          </button>
        </div>
      </div>

      <div className="modelView-card comments-card">
        <h2 className="comments-title">Комментарии ({comments.length})</h2>

        {user ? (
          <form className="comment-form" onSubmit={handleSubmitComment}>
            <textarea
              className="comment-input"
              placeholder="Оставьте комментарий..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
            />
            <button
              className="download-button"
              type="submit"
              disabled={!commentText.trim()}
            >
              Отправить
            </button>
          </form>
        ) : (
          <div className="comment-auth-prompt">
            <span>Войдите, чтобы оставить комментарий</span>
            <button className="download-button" onClick={() => setShowLogin(true)}>
              Войти
            </button>
          </div>
        )}

        <ul className="comment-list">
          {comments.length === 0 && (
            <li className="comment-empty">Пока нет комментариев</li>
          )}
          {comments.map((c) => (
            <li key={c.id} className="comment-item">
              <div className="comment-head">
                <span className="comment-author">{c.nickname}</span>
                <span className="comment-date">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="comment-text">{c.text}</div>
              {user?.id === c.userId && (
                <button
                  className="comment-delete"
                  onClick={() => handleDeleteComment(c.id)}
                >
                  Удалить
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}
