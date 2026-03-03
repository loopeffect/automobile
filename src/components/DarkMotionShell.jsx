import { AnimatePresence, motion } from 'framer-motion';
import { animated, useSpring } from '@react-spring/web';
import { useLocation } from 'react-router-dom';

const MotionDiv = motion.div;
const AnimatedDiv = animated.div;

const DarkMotionShell = ({ children }) => {
  const location = useLocation();

  const orbA = useSpring({
    from: { transform: 'translate3d(0px, 0px, 0px) scale(1)', opacity: 0.16 },
    to: [
      { transform: 'translate3d(26px, -18px, 0px) scale(1.08)', opacity: 0.23 },
      { transform: 'translate3d(-14px, 20px, 0px) scale(0.96)', opacity: 0.14 },
      { transform: 'translate3d(0px, 0px, 0px) scale(1)', opacity: 0.16 },
    ],
    loop: true,
    config: { mass: 7, tension: 28, friction: 24 },
  });

  const orbB = useSpring({
    from: { transform: 'translate3d(0px, 0px, 0px) scale(1)', opacity: 0.2 },
    to: [
      { transform: 'translate3d(-24px, 20px, 0px) scale(1.05)', opacity: 0.28 },
      { transform: 'translate3d(20px, -12px, 0px) scale(0.94)', opacity: 0.18 },
      { transform: 'translate3d(0px, 0px, 0px) scale(1)', opacity: 0.2 },
    ],
    loop: true,
    config: { mass: 8, tension: 26, friction: 22 },
  });

  return (
    <div className="alvio-market-root min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <AnimatedDiv
          style={orbA}
          className="absolute -top-24 -left-24 w-[24rem] h-[24rem] rounded-full bg-blue-500/30 blur-3xl"
        />
        <AnimatedDiv
          style={orbB}
          className="absolute top-36 -right-24 w-[22rem] h-[22rem] rounded-full bg-[#0f1d40] blur-3xl"
        />
      </div>

      <AnimatePresence mode="wait">
        <MotionDiv
          key={location.pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative z-10"
        >
          {children}
        </MotionDiv>
      </AnimatePresence>
    </div>
  );
};

export default DarkMotionShell;
