import React, { useCallback } from 'react';
import Memo from "./Memo/Memo";
import AddBoxIcon from '@mui/icons-material/AddBox';
import { observer } from 'mobx-react';

function App({store}) {
  const addMemo = useCallback(() => {
    store.addMemo();
  },[store])

  const editMemo = useCallback((id,content) => {
    store.editMemo(id, content)
  },[store])

  const setPosition = useCallback((id,x,y) => {
    store.setPosition(id,x,y);
  },[store])

  const setWidthHeight = useCallback((id, width, height) => {
    store.setWidthHeight(id,width, height);
  },[store])

  const deleteMemo = useCallback((id) => {
    store.removeMemo(id)
  },[store])
  return (
    <>
    {
      store.memos.map((memo) => <Memo 
      key={memo.id} 
      item={memo} 
      edit={editMemo}
      setWidthHeight={setWidthHeight}
      setPosition={setPosition}
      deleteMemo={deleteMemo}/>)
    }
    <AddBoxIcon sx={{float:"right", cursor:"pointer", fontSize:"40px", ":hover":{opacity:0.7}}} 
    onClick={addMemo}/>
    </>
  );
}

export default observer(App);
