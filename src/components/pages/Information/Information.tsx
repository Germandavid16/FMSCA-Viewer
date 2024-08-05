import { Layout } from "../../common/Layout/Layout.tsx";
import { useParams } from "react-router-dom";

export const Information = () => {
  const { id } = useParams();

  return <Layout>{id}</Layout>;
};
