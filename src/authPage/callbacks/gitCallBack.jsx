import React, { useEffect } from "react";

const GitCallBack = () => {
  useEffect(() => {
    let code = new URLSearchParams(window.location.search).get("code");
    window.opener.postMessage({code,from:'Git_auth'})
    window.close()
  }, []);
  return <div>Loading.....</div>;
};

export default GitCallBack;
