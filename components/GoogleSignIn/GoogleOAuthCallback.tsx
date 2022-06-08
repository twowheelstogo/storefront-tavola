import * as React from "react";
// import { useLocation } from 'react-router-dom';
import { useRouter } from "next/router";
import qs from "qs";

// type IEmailVerificationPageProps = RouteComponentProps<{
//   token: string;
// }>;

export const GoogleOAuthCallback: React.FC = () => {
  const router = useRouter();
  let params = router.query as any;
  try {
    const queryParams = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    });
    params = queryParams;
  } catch (e) {}

  React.useEffect(() => {
    const googleLoginChannel = new BroadcastChannel("googleLoginChannel");
    googleLoginChannel.postMessage(params.code);
    googleLoginChannel.close();
    window.close();
  }, [params.code]);

  return <React.Fragment></React.Fragment>;
};
