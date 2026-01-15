import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Trainer.css';

type Point = { x: number; y: number };
type AimCircle = {
  x: number;
  y: number;
  radius: number;
  approachRadius: number;
  spawnTime: number;
  hitTime: number;
  hit: boolean;
  missed: boolean;
  hitScore?: '300' | '100' | '50';
};

const canvasSize = { width: 1200, height: 800 };
const aimCanvasSize = { width: 1200, height: 800 };

const Trainer = () => {
  const { t, i18n } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const aimCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [mode, setMode] = useState<'robot' | 'field'>('robot');
  const [controllerId, setControllerId] = useState<string | null>(null);
  const [trainerActive, setTrainerActive] = useState(false);
  const [showFinish, setShowFinish] = useState(false);
  const [finishTime, setFinishTime] = useState<number | null>(null);
  const [checkpointInfo, setCheckpointInfo] = useState({ current: 0, total: 0 });

  const robotRef = useRef({
    x: canvasSize.width / 2,
    y: canvasSize.height / 2,
    angle: -Math.PI / 2,
    vx: 0,
    vy: 0,
    omega: 0,
    width: 60,
    height: 60,
    maxSpeed: 600,
    maxAngularSpeed: 7,
  });

  const gpRef = useRef<Gamepad | null>(null);
  const checkpointsRef = useRef<Point[]>([]);
  const currentCPRef = useRef(0);
  const startTimeRef = useRef(0);
  const fieldCentricRef = useRef(false);
  const trainerActiveRef = useRef(false);
  const triangleLatchRef = useRef(false);
  const xLatchRef = useRef(false);

  // Aim trainer state/refs
  const aimRunningRef = useRef(false);
  const aimPausedRef = useRef(false);
  const aimDifficultyRef = useRef(1);
  const aimNextSpawnRef = useRef(0);
  const aimCirclesRef = useRef<AimCircle[]>([]);
  const aimStatsRef = useRef({
    score: 0,
    combo: 0,
    maxCombo: 0,
    hits300: 0,
    hits100: 0,
    hits50: 0,
    misses: 0,
    accuracy: 100,
  });
  const [aimStats, setAimStats] = useState(aimStatsRef.current);
  const [aimDifficulty, setAimDifficulty] = useState(() => t('trainer.canvas.difficulty.normal'));
  const [aimRunning, setAimRunning] = useState(false);
  const [aimPaused, setAimPaused] = useState(false);

  const aimDifficulties = useMemo(
    () => [
      { name: t('trainer.canvas.difficulty.easy'), approachTime: 2000, spawnInterval: 1500, tolerance: 0.15 },
      { name: t('trainer.canvas.difficulty.normal'), approachTime: 1500, spawnInterval: 1000, tolerance: 0.12 },
      { name: t('trainer.canvas.difficulty.hard'), approachTime: 1000, spawnInterval: 700, tolerance: 0.08 },
    ],
    [i18n.language, t]
  );

  const controllerLabel = controllerId ?? t('trainer.controller.notDetected');

  useEffect(() => {
    setAimDifficulty(aimDifficulties[aimDifficultyRef.current].name);
  }, [aimDifficulties]);

  const round = (v: number) => (Math.abs(v) < 0.0005 ? 0 : Math.round(v * 1000) / 1000);

  const generatePath = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const points: Point[] = [];
    const count = 7 + Math.floor(Math.random() * 4);

    for (let i = 0; i < count; i++) {
      let x: number;
      let y: number;

      do {
        x = 100 + Math.random() * (canvas.width - 200);
        y = 100 + Math.random() * (canvas.height - 200);
      } while (points.some((p) => Math.hypot(p.x - x, p.y - y) < 150));

      points.push({ x, y });
    }

    checkpointsRef.current = points;
    currentCPRef.current = 0;
    setCheckpointInfo({ current: 0, total: points.length });
  }, []);

  const resetRobot = useCallback(() => {
    const robot = robotRef.current;
    robot.x = canvasSize.width / 2;
    robot.y = canvasSize.height / 2;
    robot.angle = -Math.PI / 2;
    robot.vx = 0;
    robot.vy = 0;
    robot.omega = 0;
  }, []);

  const beginTrainer = useCallback(() => {
    generatePath();
    trainerActiveRef.current = true;
    setTrainerActive(true);
    startTimeRef.current = performance.now();
    setShowFinish(false);
    setFinishTime(null);
    resetRobot();
  }, [generatePath, resetRobot]);

  const restartTrainer = useCallback(() => {
    if (checkpointsRef.current.length === 0) {
      generatePath();
    }
    currentCPRef.current = 0;
    setCheckpointInfo({ current: 0, total: checkpointsRef.current.length });
    trainerActiveRef.current = true;
    setTrainerActive(true);
    setShowFinish(false);
    setFinishTime(null);
    startTimeRef.current = performance.now();
    resetRobot();
  }, [generatePath, resetRobot]);

  const resetAimStats = useCallback(() => {
    aimStatsRef.current = {
      score: 0,
      combo: 0,
      maxCombo: 0,
      hits300: 0,
      hits100: 0,
      hits50: 0,
      misses: 0,
      accuracy: 100,
    };
    setAimStats(aimStatsRef.current);
  }, []);

  const startAimTrainer = useCallback(() => {
    resetAimStats();
    aimCirclesRef.current = [];
    aimNextSpawnRef.current = performance.now();
    aimRunningRef.current = true;
    aimPausedRef.current = false;
    setAimRunning(true);
    setAimPaused(false);
  }, [resetAimStats]);

  const pauseAimTrainer = useCallback(() => {
    aimPausedRef.current = !aimPausedRef.current;
    setAimPaused(aimPausedRef.current);
  }, []);

  const stopAimTrainer = useCallback(() => {
    aimRunningRef.current = false;
    aimPausedRef.current = false;
    setAimRunning(false);
    setAimPaused(false);
  }, []);

  const cycleAimDifficulty = useCallback(() => {
    aimDifficultyRef.current = (aimDifficultyRef.current + 1) % aimDifficulties.length;
    setAimDifficulty(aimDifficulties[aimDifficultyRef.current].name);
  }, [aimDifficulties]);

  const updateAimAccuracy = useCallback(() => {
    const stats = aimStatsRef.current;
    const totalHits = stats.hits300 + stats.hits100 + stats.hits50;
    const total = totalHits + stats.misses;
    stats.accuracy =
      total > 0 ? ((stats.hits300 * 300 + stats.hits100 * 100 + stats.hits50 * 50) / (total * 300)) * 100 : 100;
    setAimStats({ ...stats });
  }, []);

  const endTrainer = useCallback(() => {
    trainerActiveRef.current = false;
    setTrainerActive(false);
    setShowFinish(false);
  }, []);

  const finishTrainer = useCallback(() => {
    const time = (performance.now() - startTimeRef.current) / 1000;
    setFinishTime(time);
    setShowFinish(true);
    trainerActiveRef.current = false;
    setTrainerActive(false);
  }, []);

  useEffect(() => {
    fieldCentricRef.current = mode === 'field';
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ACC = 2000;
    const ANG_ACC = 20;
    const FRICTION = 0.88;
    const ANG_FRICTION = 0.84;
    const STATIC_THRESHOLD = 0.12;
    const STATIC_RELEASE = 30;
    const BRAKE = 3;

    const mecanum = (tvx: number, tvy: number, tom: number, dt: number) => {
      const robot = robotRef.current;
      const tVX = tvx * robot.maxSpeed;
      const tVY = tvy * robot.maxSpeed;
      const tOM = tom * robot.maxAngularSpeed;

      const maxA = ACC * dt;
      const maxAR = ANG_ACC * dt;

      const diffX = tVX - robot.vx;
      if (Math.abs(tvx) > 0.01) {
        if (Math.abs(robot.vx) < 2 && Math.abs(tvx) < STATIC_THRESHOLD) robot.vx = 0;
        else if (Math.abs(robot.vx) < 2) robot.vx = Math.sign(tvx) * STATIC_RELEASE;
        else {
          const opp = Math.sign(tvx) !== Math.sign(robot.vx);
          robot.vx += Math.sign(diffX) * Math.min(maxA * (opp ? BRAKE : 1), Math.abs(diffX));
        }
      } else {
        robot.vx *= FRICTION;
      }

      const diffY = tVY - robot.vy;
      if (Math.abs(tvy) > 0.01) {
        if (Math.abs(robot.vy) < 2 && Math.abs(tvy) < STATIC_THRESHOLD) robot.vy = 0;
        else if (Math.abs(robot.vy) < 2) robot.vy = Math.sign(tvy) * STATIC_RELEASE;
        else {
          const opp = Math.sign(tvy) !== Math.sign(robot.vy);
          robot.vy += Math.sign(diffY) * Math.min(maxA * (opp ? BRAKE : 1), Math.abs(diffY));
        }
      } else {
        robot.vy *= FRICTION;
      }

      const diffOm = tOM - robot.omega;
      if (Math.abs(tom) > 0.01) {
        const opp = Math.sign(tom) !== Math.sign(robot.omega);
        robot.omega += Math.sign(diffOm) * Math.min(maxAR * (opp ? BRAKE : 1), Math.abs(diffOm));
      } else {
        robot.omega *= ANG_FRICTION;
      }

      robot.vx = round(robot.vx);
      robot.vy = round(robot.vy);
      robot.omega = round(robot.omega);

      robot.angle += robot.omega * dt;

      const c = Math.cos(robot.angle);
      const s = Math.sin(robot.angle);

      const gVx = robot.vx * c - robot.vy * s;
      const gVy = robot.vx * s + robot.vy * c;

      robot.x += gVx * dt;
      robot.y += gVy * dt;
      robot.x = Math.max(robot.width / 2, Math.min(canvas.width - robot.width / 2, robot.x));
      robot.y = Math.max(robot.height / 2, Math.min(canvas.height - robot.height / 2, robot.y));
    };

    const drawRobot = () => {
      const robot = robotRef.current;
      ctx.save();
      ctx.translate(robot.x, robot.y);
      ctx.rotate(robot.angle);
      ctx.fillStyle = '#4a90e2';
      ctx.fillRect(-robot.width / 2, -robot.height / 2, robot.width, robot.height);
      ctx.fillStyle = 'red';
      ctx.fillRect(robot.width / 2 - 10, -5, 10, 10);
      ctx.restore();
    };

    const drawPath = () => {
      const points = checkpointsRef.current;
      if (points.length < 2) return;

      ctx.strokeStyle = '#6da8ff';
      ctx.lineWidth = 3;
      ctx.beginPath();

      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] || points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || p2;

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        if (i === 0) ctx.moveTo(p1.x, p1.y);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
      }
      ctx.stroke();
    };

    const drawCheckpoints = () => {
      const points = checkpointsRef.current;
      for (let i = 0; i < points.length; i++) {
        const cp = points[i];
        let color = 'rgba(255,255,255,0.3)';
        let radius = 20;

        if (i < currentCPRef.current) {
          color = 'rgba(0,255,0,0.35)';
        } else if (i === currentCPRef.current) {
          const pulse = 0.5 + 0.3 * Math.sin(performance.now() / 200);
          color = `rgba(255,255,0,${pulse})`;
          radius = 24;
        }

        ctx.beginPath();
        ctx.arc(cp.x, cp.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    };

    const gamepadControl = (dt: number) => {
      const gp = gpRef.current;
      if (!gp) return;
      const g = navigator.getGamepads()[gp.index];
      if (!g) return;

      let lx = g.axes[0] ?? 0;
      let ly = g.axes[1] ?? 0;
      let rx = g.axes[2] ?? 0;
      if (Math.abs(rx) < 0.05 && g.axes[3] !== undefined) rx = g.axes[3];

      if (Math.abs(lx) < 0.04) lx = 0;
      if (Math.abs(ly) < 0.04) ly = 0;
      if (Math.abs(rx) < 0.04) rx = 0;

      let forward = -ly;
      let strafe = lx;

      if (fieldCentricRef.current) {
        const fieldX = strafe;
        const fieldY = -forward;
        const ca = Math.cos(-robotRef.current.angle - Math.PI / 2);
        const sa = Math.sin(-robotRef.current.angle - Math.PI / 2);
        const rxField = fieldX * ca - fieldY * sa;
        const ryField = fieldX * sa + fieldY * ca;
        forward = -ryField;
        strafe = rxField;
      }

      mecanum(forward, strafe, rx, dt);

      if (g.buttons[0]?.pressed) {
        if (!xLatchRef.current) {
          beginTrainer();
          xLatchRef.current = true;
        }
      } else {
        xLatchRef.current = false;
      }

      if (g.buttons[3]?.pressed) {
        if (!triangleLatchRef.current) {
          const next = fieldCentricRef.current ? 'robot' : 'field';
          setMode(next);
          triangleLatchRef.current = true;
        }
      } else {
        triangleLatchRef.current = false;
      }
    };

    const loop = () => {
      let last = performance.now();

      const frame = () => {
        const now = performance.now();
        const dt = Math.min((now - last) / 1000, 0.1);
        last = now;

        ctx.fillStyle = '#05070e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (gpRef.current) {
          gamepadControl(dt);
        }

        if (trainerActiveRef.current) {
          drawPath();
          drawCheckpoints();

          const checkpoints = checkpointsRef.current;
          const current = checkpoints[currentCPRef.current];
          if (current) {
            const d = Math.hypot(robotRef.current.x - current.x, robotRef.current.y - current.y);
            if (d < 40) {
              currentCPRef.current += 1;
              setCheckpointInfo({ current: currentCPRef.current, total: checkpoints.length });
              if (currentCPRef.current >= checkpoints.length) {
                finishTrainer();
              }
            }
          }
        }

        drawRobot();
        animationId = requestAnimationFrame(frame);
      };

      animationId = requestAnimationFrame(frame);
    };

    const handleConnect = (e: GamepadEvent) => {
      gpRef.current = navigator.getGamepads()[e.gamepad.index];
      setControllerId(e.gamepad.id || t('trainer.controller.connected'));
    };

    const handleDisconnect = () => {
      gpRef.current = null;
      setControllerId(null);
    };

    window.addEventListener('gamepadconnected', handleConnect);
    window.addEventListener('gamepaddisconnected', handleDisconnect);

    let animationId = 0;
    generatePath();
    loop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('gamepadconnected', handleConnect);
      window.removeEventListener('gamepaddisconnected', handleDisconnect);
    };
  }, [beginTrainer, finishTrainer, generatePath, t]);

  // Aim trainer loop
  useEffect(() => {
    const canvas = aimCanvasRef.current;
    if (!canvas) return;
    canvas.width = aimCanvasSize.width;
    canvas.height = aimCanvasSize.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const radius = 200;
    const leftCenter = { x: 300, y: 400 };
    const rightCenter = { x: 900, y: 400 };

    const joystickToScreen = (stickX: number, stickY: number, centerX: number, centerY: number) => ({
      x: centerX + stickX * radius,
      y: centerY + stickY * radius,
    });

    const generateRandomPosition = () => {
      const useLeft = Math.random() < 0.5;
      const center = useLeft ? leftCenter : rightCenter;
      const ang = Math.random() * Math.PI * 2;
      const dist = Math.random() * radius;
      return { x: center.x + Math.cos(ang) * dist, y: center.y + Math.sin(ang) * dist };
    };

    const drawJoystickArea = (center: { x: number; y: number }, label: string) => {
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(label, center.x, center.y - radius - 24);
    };

    const drawJoystickPos = (center: { x: number; y: number }, stickX: number, stickY: number, color: string) => {
      const posX = center.x + stickX * radius;
      const posY = center.y + stickY * radius;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(posX, posY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    let anim = 0;

    const frame = () => {
      const now = performance.now();

      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Base joystick guides
      drawJoystickArea(leftCenter, t('trainer.canvas.leftStick'));
      drawJoystickArea(rightCenter, t('trainer.canvas.rightStick'));

      const gamepad = gpRef.current ? navigator.getGamepads()[gpRef.current.index] : null;
      if (!gamepad) {
        // No controller overlay
        ctx.fillStyle = 'rgba(0,0,0,0.65)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff4d4f';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(t('trainer.canvas.noController'), canvas.width / 2, canvas.height / 2);
        anim = requestAnimationFrame(frame);
        return;
      }

      const lx = gamepad.axes[0] ?? 0;
      const ly = gamepad.axes[1] ?? 0;
      const rx = gamepad.axes[2] ?? 0;
      const ry = gamepad.axes[3] ?? 0;

      drawJoystickPos(leftCenter, lx, ly, '#66aaff');
      drawJoystickPos(rightCenter, rx, ry, '#ff66aa');

      if (aimRunningRef.current && !aimPausedRef.current) {
          const difficulty = aimDifficulties[aimDifficultyRef.current];
        if (now >= aimNextSpawnRef.current) {
          const pos = generateRandomPosition();
          aimCirclesRef.current.push({
            x: pos.x,
            y: pos.y,
            radius: 50,
            approachRadius: 150,
            spawnTime: now,
            hitTime: now + difficulty.approachTime,
            hit: false,
            missed: false,
          });
          aimNextSpawnRef.current = now + difficulty.spawnInterval;
        }
      }

      // Update circles
      const circles = aimCirclesRef.current;
      for (let i = circles.length - 1; i >= 0; i -= 1) {
        const c = circles[i];
        const timeLeft = c.hitTime - now;
        const totalTime = c.hitTime - c.spawnTime;
        const progress = Math.max(0, Math.min(1, 1 - timeLeft / totalTime));
        c.approachRadius = 150 - progress * 100;

        if (!c.hit && !c.missed && now >= c.hitTime - 200) {
          const leftPos = joystickToScreen(lx, ly, leftCenter.x, leftCenter.y);
          const rightPos = joystickToScreen(rx, ry, rightCenter.x, rightCenter.y);
          const leftDistSq = (c.x - leftPos.x) ** 2 + (c.y - leftPos.y) ** 2;
          const rightDistSq = (c.x - rightPos.x) ** 2 + (c.y - rightPos.y) ** 2;
          const minDistSq = Math.min(leftDistSq, rightDistSq);
          const tolerance = c.radius + aimDifficulties[aimDifficultyRef.current].tolerance * 50;
          const tolSq = tolerance * tolerance;

          if (minDistSq <= tolSq) {
            const timeDiff = Math.abs(timeLeft);
            let score: AimCircle['hitScore'] = undefined;
            if (timeDiff < 50) score = '300';
            else if (timeDiff < 100) score = '100';
            else if (timeDiff < 150) score = '50';

            if (score) {
              c.hit = true;
              c.hitScore = score;
              const stats = aimStatsRef.current;
              if (score === '300') stats.hits300 += 1;
              if (score === '100') stats.hits100 += 1;
              if (score === '50') stats.hits50 += 1;
              stats.combo += 1;
              stats.maxCombo = Math.max(stats.maxCombo, stats.combo);
              stats.score += score === '300' ? 300 : score === '100' ? 100 : 50;
              aimStatsRef.current = { ...stats };
              updateAimAccuracy();
            }
          }
        }

        if (now > c.hitTime + 100 && !c.hit && !c.missed) {
          c.missed = true;
          const stats = aimStatsRef.current;
          stats.combo = 0;
          stats.misses += 1;
          aimStatsRef.current = { ...stats };
          updateAimAccuracy();
        }

        if (now > c.hitTime + 500) {
          circles.splice(i, 1);
        }
      }

      // Draw circles
      circles.forEach((c) => {
        if (!c.hit && !c.missed) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.approachRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
        if (!c.missed) {
          ctx.fillStyle = c.hit ? '#00ff88' : '#ff66aa';
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }
        if (c.hitScore) {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 28px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(c.hitScore, c.x, c.y - 70);
        }
      });

      // HUD
      ctx.fillStyle = '#ffffff';
      ctx.font = '20px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(t('trainer.canvas.hud.score', { score: aimStatsRef.current.score }), 20, 36);
      ctx.fillText(
        t('trainer.canvas.hud.combo', { combo: aimStatsRef.current.combo, max: aimStatsRef.current.maxCombo }),
        20,
        64
      );
      ctx.fillText(
        t('trainer.canvas.hud.accuracy', { accuracy: aimStatsRef.current.accuracy.toFixed(2) }),
        20,
        92
      );
      ctx.fillText(
        t('trainer.canvas.hud.difficulty', { difficulty: aimDifficulties[aimDifficultyRef.current].name }),
        20,
        120
      );
      if (!aimRunningRef.current) {
        ctx.fillStyle = 'rgba(0,0,0,0.65)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(t('trainer.canvas.idle'), canvas.width / 2, canvas.height / 2);
      } else if (aimPausedRef.current) {
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(t('trainer.canvas.paused'), canvas.width / 2, canvas.height / 2);
      }

      anim = requestAnimationFrame(frame);
    };

    anim = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(anim);
  }, [aimDifficulties, t, updateAimAccuracy]);

  return (
    <div className="trainer-page">
      <section className="trainer-hero">
        <div className="trainer-hero-content">
          <span className="section-tag">{t('trainer.hero.tag')}</span>
          <h1 className="section-title">{t('trainer.hero.title')}</h1>
          <p>
            {t('trainer.hero.description')}
          </p>
          <div className="trainer-actions">
            <button className="cta-primary" onClick={beginTrainer}>
              {t('trainer.hero.actions.start')}
            </button>
            <button className="cta-secondary" onClick={restartTrainer}>
              {t('trainer.hero.actions.restart')}
            </button>
            <button className="cta-secondary" onClick={resetRobot}>
              {t('trainer.hero.actions.reset')}
            </button>
          </div>
          <div className="trainer-controller">
            <span className="dot"></span>
            {controllerLabel}
          </div>
        </div>
      </section>

      <section className="trainer-sim">
        <div className="trainer-container">
          <div className="sim-header">
            <div>
              <span className="section-tag">{t('trainer.sim.tag')}</span>
              <h2>{t('trainer.sim.title')}</h2>
              <p>{t('trainer.sim.description')}</p>
            </div>
            <div className="sim-buttons">
              <button className="ghost" onClick={beginTrainer} disabled={trainerActive}>
                {t('trainer.sim.buttons.start')}
              </button>
              <button className="ghost" onClick={generatePath}>
                {t('trainer.sim.buttons.newPath')}
              </button>
              <button className="ghost" onClick={restartTrainer} disabled={trainerActive}>
                {t('trainer.sim.buttons.restart')}
              </button>
              <button className="ghost" onClick={endTrainer} disabled={!trainerActive}>
                {t('trainer.sim.buttons.end')}
              </button>
              <button className="ghost" onClick={() => setMode(mode === 'robot' ? 'field' : 'robot')}>
                {t('trainer.sim.buttons.mode', {
                  mode: mode === 'robot' ? t('trainer.sim.modes.robot') : t('trainer.sim.modes.field'),
                })}
              </button>
            </div>
          </div>

          <div className="sim-body">
            <div className="canvas-wrap">
              <canvas ref={canvasRef} />
              {!gpRef.current && (
                <div className="controller-warning">
                  <p>{t('trainer.sim.noController.title')}</p>
                  <span>{t('trainer.sim.noController.description')}</span>
                </div>
              )}

              {showFinish && finishTime !== null && (
                <div className="finish-popup">
                  <h3>{t('trainer.sim.finish.title')}</h3>
                  <p>{t('trainer.sim.finish.time', { time: finishTime.toFixed(2) })}</p>
                  <div className="finish-actions">
                    <button className="cta-secondary" onClick={restartTrainer}>
                      {t('trainer.sim.finish.restart')}
                    </button>
                    <button className="cta-primary" onClick={beginTrainer}>
                      {t('trainer.sim.finish.newRun')}
                    </button>
                    <button className="cta-secondary" onClick={generatePath}>
                      {t('trainer.sim.finish.shuffle')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="sim-sidebar">
              <div className="info-card">
                <h4>{t('trainer.status.title')}</h4>
                <p>{trainerActive ? t('trainer.status.active') : t('trainer.status.idle')}</p>
                <div className="status-grid">
                  <div>
                    <span className="label">{t('trainer.status.labels.mode')}</span>
                    <span className="value">{mode === 'robot' ? t('trainer.sim.modes.robot') : t('trainer.sim.modes.field')}</span>
                  </div>
                  <div>
                    <span className="label">{t('trainer.status.labels.checkpoint')}</span>
                    <span className="value">
                      {checkpointInfo.current}/{checkpointInfo.total || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="label">{t('trainer.status.labels.controller')}</span>
                    <span className="value">{controllerLabel}</span>
                  </div>
                </div>
              </div>

              <div className="info-card">
                <h4>{t('trainer.controls.title')}</h4>
                <ul className="controls-list">
                  <li><strong>{t('trainer.controls.leftStick.label')}:</strong> {t('trainer.controls.leftStick.value')}</li>
                  <li><strong>{t('trainer.controls.rightStick.label')}:</strong> {t('trainer.controls.rightStick.value')}</li>
                  <li><strong>{t('trainer.controls.newPath.label')}:</strong> {t('trainer.controls.newPath.value')}</li>
                  <li><strong>{t('trainer.controls.toggleMode.label')}:</strong> {t('trainer.controls.toggleMode.value')}</li>
                  <li><strong>{t('trainer.controls.buttons.label')}:</strong> {t('trainer.controls.buttons.value')}</li>
                </ul>
              </div>

              <div className="info-card">
                <h4>{t('trainer.tips.title')}</h4>
                <ul className="controls-list">
                  <li>{t('trainer.tips.items.0')}</li>
                  <li>{t('trainer.tips.items.1')}</li>
                  <li>{t('trainer.tips.items.2')}</li>
                  <li>{t('trainer.tips.items.3')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="aim-section">
        <div className="trainer-container">
          <div className="sim-header">
            <div>
              <span className="section-tag">{t('trainer.aim.tag')}</span>
              <h2>{t('trainer.aim.title')}</h2>
              <p>{t('trainer.aim.description')}</p>
            </div>
            <div className="sim-buttons">
              <button className="ghost" onClick={startAimTrainer}>
                {t('trainer.aim.buttons.start')}
              </button>
              <button className="ghost" onClick={pauseAimTrainer} disabled={!aimRunning}>
                {aimPaused ? t('trainer.aim.buttons.resume') : t('trainer.aim.buttons.pause')}
              </button>
              <button className="ghost" onClick={stopAimTrainer} disabled={!aimRunning}>
                {t('trainer.aim.buttons.stop')}
              </button>
              <button className="ghost" onClick={cycleAimDifficulty}>
                {t('trainer.aim.buttons.difficulty', { difficulty: aimDifficulty })}
              </button>
            </div>
          </div>

          <div className="aim-body">
            <div className="canvas-wrap aim-canvas">
              <canvas ref={aimCanvasRef} />
            </div>
            <div className="info-card">
              <h4>{t('trainer.aim.stats.title')}</h4>
              <ul className="controls-list">
                <li>
                  <strong>{t('trainer.aim.stats.score')}:</strong> {aimStats.score.toLocaleString()}
                </li>
                <li>
                  <strong>{t('trainer.aim.stats.combo')}:</strong> {aimStats.combo} ({t('trainer.aim.stats.max')} {aimStats.maxCombo})
                </li>
                <li>
                  <strong>{t('trainer.aim.stats.accuracy')}:</strong> {aimStats.accuracy.toFixed(2)}%
                </li>
                <li>
                  <strong>{t('trainer.aim.stats.hits')}:</strong> 300: {aimStats.hits300} · 100: {aimStats.hits100} · 50: {aimStats.hits50}
                </li>
                <li>
                  <strong>{t('trainer.aim.stats.misses')}:</strong> {aimStats.misses}
                </li>
              </ul>
              <p className="controls-note">
                {t('trainer.aim.note')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Trainer;

