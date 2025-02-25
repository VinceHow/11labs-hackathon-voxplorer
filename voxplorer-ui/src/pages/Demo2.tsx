import { IMAGES } from "@/constants/images";
import DemoScreen from "../components/DemoScreen";

const Demo2 = () => {
  return (
    <DemoScreen
      imageUrl={IMAGES.DEMO_2}
      redirectUrl="/narrate-rebook"
      altText="Demo Screen 2"
    />
  );
};

export default Demo2; 