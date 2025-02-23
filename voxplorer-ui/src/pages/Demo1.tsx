import { IMAGES } from "@/constants/images";
import DemoScreen from "../components/DemoScreen";

const Demo1 = () => {
  return (
    <DemoScreen
      imageUrl={IMAGES.DEMO_1}
      redirectUrl="/welcome"
      altText="Demo Screen 1"
    />
  );
};

export default Demo1; 