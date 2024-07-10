import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import CardWrapper from "../../components/ui/CardWrapper/CardWrapper";
// here will get kinds from recommendation system
const activity_types = ["beaches", "urban_environment", "architecture"];
const Home = () => {
  return (
    <>
      <CardWrapper activity={activity_types[0]} />
      <CardWrapper activity={activity_types[1]} />
      <CardWrapper activity={activity_types[2]} />
    </>
  );
};
export default Home;
