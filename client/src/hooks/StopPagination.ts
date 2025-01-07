import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const useStopPropagationandNavigate = () => {
  const navigate = useNavigate()
  const onStartShouldSetResponder = useCallback(() => true, []);
  const onTouchEnd = useCallback((e: React.MouseEvent<HTMLDivElement>, path?: string) => {
    e.stopPropagation();
    if (path) {
      navigate(path)
    }
  }, [navigate]);

  return {
    onStartShouldSetResponder,
    onTouchEnd,
  };
};
