import { IMAGES } from "@/constants/images";
import DemoScreen from "../components/DemoScreen";

const Demo3 = () => {
  return (
    <DemoScreen
      imageUrl={IMAGES.DEMO_3}
      redirectUrl="/site/1"
      altText="Demo Screen 3"
    />
  );
};

export default Demo3; 