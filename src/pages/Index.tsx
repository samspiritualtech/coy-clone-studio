import { OGURA_EDITORIAL_HOMEPAGE_ENABLED } from "@/config/homepage";
import OguraEditorialHomepage from "@/components/editorial/OguraEditorialHomepage";
import IndexLegacy from "./IndexLegacy";

const Index = () => {
  return OGURA_EDITORIAL_HOMEPAGE_ENABLED ? <OguraEditorialHomepage /> : <IndexLegacy />;
};

export default Index;
