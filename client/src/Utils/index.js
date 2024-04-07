import { useDispatch } from "react-redux";
import { useMemo } from "react";
import { bindActionCreators } from "redux";

export function useActions(actions, deps) {
    const dispatch = useDispatch();
    return useMemo(
      () => {
        if (Array.isArray(actions)) {
          return actions.map(a =>
            bindActionCreators(a.hasOwnProperty("init") ? a.init : a, dispatch)
          );
        }
        return bindActionCreators(
          actions.hasOwnProperty("init") ? actions.init : actions,
          dispatch
        );
      },
      // eslint-disable-next-line
      deps ? [dispatch, ...deps] : [dispatch]
    );
  }