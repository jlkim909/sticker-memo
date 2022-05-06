import React, {
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useLayoutEffect,
} from "react";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CloseIcon from "@mui/icons-material/Close";
import "./Memo.scss";
import Draggable from "../Draggable/Draggable";
import { debounce } from "underscore";
import { observer } from "mobx-react";

function Memo({ item, edit, setWidthHeight, setPosition, deleteMemo }) {
  const handleRef = useRef(null);
  const MemoRef = useRef(null);
  const onMoveMemo = useCallback(
    (x, y) => {
      setPosition(item.id, x, y);
    },
    [setPosition, item.id]
  );

  const onEditMemo = useMemo(
    () => debounce((e) => edit(item.id, e.target.value), 500),
    [edit, item.id]
  );

  const onChangeSize = useMemo(
    () =>
      debounce((entry) => {
        const { width, height } = entry[0].contentRect;
        setWidthHeight(item.id, width, height);
      }, 100),
    [item.id, setWidthHeight]
  );

  const onClickDelete = useCallback(() => {
    deleteMemo(item.id);
  }, [item.id, deleteMemo]);
  useLayoutEffect(() => {
    let RO = new ResizeObserver(onChangeSize);
    RO.observe(MemoRef.current);
    return () => {
      RO.disconnect();
      RO = null;
    };
  }, [setWidthHeight, onChangeSize]);
  useEffect(() => {
    return () => {
      onEditMemo.cancel();
      onChangeSize.cancel();
    };
  }, [onEditMemo, onChangeSize]);

  return (
    <Draggable handleRef={handleRef} onMove={onMoveMemo} x={item.x} y={item.y}>
      <div
        className="memo-container"
        ref={MemoRef}
        style={{ width: `${item.width}px`, height: `${item.height}px` }}
      >
        <div className="menu">
          <FormatListBulletedIcon
            ref={handleRef}
            style={{ cursor: "pointer" }}
          />
          <CloseIcon style={{ cursor: "pointer" }} onClick={onClickDelete} />
        </div>
        <textarea
          className="memo-text"
          defaultValue={item.content}
          name="txt"
          placeholder="Enter memo here"
          onChange={onEditMemo}
        ></textarea>
      </div>
    </Draggable>
  );
}

export default observer(Memo);
