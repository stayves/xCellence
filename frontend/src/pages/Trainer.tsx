import { useCallback, useEffect, useRef, useState } from 'react';
import './Trainer.css';

type Point = { x: number; y: number };

const canvasSize = { width: 1200, height: 800 };

const Trainer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [mode, setMode] = useState<'robot' | 'field'>('robot');
  const [controllerLabel, setControllerLabel] = useState('No controller detected');
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
      setControllerLabel(e.gamepad.id || 'Controller connected');
    };

    const handleDisconnect = () => {
      gpRef.current = null;
      setControllerLabel('No controller detected');
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
  }, [beginTrainer, finishTrainer, generatePath]);

  return (
    <div className="trainer-page">
      <section className="trainer-hero">
        <div className="trainer-hero-content">
          <span className="section-tag">Driver Practice</span>
          <h1 className="section-title">Driver Trainer Simulator</h1>
          <p>
            Practice mecanum control and checkpoint runs with a connected gamepad. Swap between robot-centric and
            field-centric driving and generate randomized training paths on the fly.
          </p>
          <div className="trainer-actions">
            <button className="cta-primary" onClick={beginTrainer}>
              Start Training Run
            </button>
            <button className="cta-secondary" onClick={resetRobot}>
              Reset Robot
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
              <span className="section-tag">Live Simulator</span>
              <h2>Mecanum Trainer</h2>
              <p>Use a PS/Xbox controller: Left stick = move, Right stick X = turn.</p>
            </div>
            <div className="sim-buttons">
              <button className="ghost" onClick={beginTrainer} disabled={trainerActive}>
                Start Trainer
              </button>
              <button className="ghost" onClick={generatePath}>
                New Path
              </button>
              <button className="ghost" onClick={endTrainer} disabled={!trainerActive}>
                End Trainer
              </button>
              <button className="ghost" onClick={() => setMode(mode === 'robot' ? 'field' : 'robot')}>
                Mode: {mode === 'robot' ? 'Robot-Centric' : 'Field-Centric'}
              </button>
            </div>
          </div>

          <div className="sim-body">
            <div className="canvas-wrap">
              <canvas ref={canvasRef} />
              {!gpRef.current && (
                <div className="controller-warning">
                  <p>No controller detected.</p>
                  <span>Connect a gamepad and press any button to begin.</span>
                </div>
              )}

              {showFinish && finishTime !== null && (
                <div className="finish-popup">
                  <h3>Training Complete</h3>
                  <p>Time: {finishTime.toFixed(2)}s</p>
                  <div className="finish-actions">
                    <button className="cta-primary" onClick={beginTrainer}>
                      New Run
                    </button>
                    <button className="cta-secondary" onClick={generatePath}>
                      Shuffle Path
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="sim-sidebar">
              <div className="info-card">
                <h4>Trainer Status</h4>
                <p>{trainerActive ? 'Active — follow the glowing checkpoint rings.' : 'Idle — start a new run to begin.'}</p>
                <div className="status-grid">
                  <div>
                    <span className="label">Mode</span>
                    <span className="value">{mode === 'robot' ? 'Robot-Centric' : 'Field-Centric'}</span>
                  </div>
                  <div>
                    <span className="label">Checkpoint</span>
                    <span className="value">
                      {checkpointInfo.current}/{checkpointInfo.total || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="label">Controller</span>
                    <span className="value">{controllerLabel}</span>
                  </div>
                </div>
              </div>

              <div className="info-card">
                <h4>Controls</h4>
                <ul className="controls-list">
                  <li><strong>Left Stick:</strong> Forward / strafe</li>
                  <li><strong>Right Stick X:</strong> Rotate</li>
                  <li><strong>X / A:</strong> New randomized path</li>
                  <li><strong>△ / Y:</strong> Toggle field-centric mode</li>
                  <li><strong>Buttons above:</strong> Start, End, Mode toggle</li>
                </ul>
              </div>

              <div className="info-card">
                <h4>Tips</h4>
                <ul className="controls-list">
                  <li>Keep motion smooth to avoid overshooting checkpoints.</li>
                  <li>Field-centric mode aligns movement to the field instead of robot heading.</li>
                  <li>Use New Path to practice different trajectories quickly.</li>
                  <li>Reset Robot if you drift too far off-center.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Trainer;

