import DemoScreen from "../components/DemoScreen";
import { IMAGES } from "@/constants/images";
const Demo4 = () => {
  return (
    <DemoScreen
      imageUrl={IMAGES.DEMO_4}
      redirectUrl="/narrate"
      altText="Demo Screen 4"
    />
  );
};

export default Demo4; 