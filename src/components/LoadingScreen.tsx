import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen = ({ message = 'Loading...' }: LoadingScreenProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center space-y-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto"
        >
          <Leaf className="w-8 h-8 text-primary" />
        </motion.div>
        <p className="text-muted-foreground font-medium">{message}</p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
