import FeaturedVideo from "../../components/dashboard/feturedvedio/FeaturedVedio";
import PaymentSection from "../../components/dashboard/Paymentsection/PaymentSection";
import PlansSection from "../../components/dashboard/plansection/PlansSection";
import Stats from "../../components/dashboard/stats/Stats";
import VideoShowcase from "../../components/dashboard/vedioshowcase/VideoShowcase";
import PlatformFilter from "../../components/dashboard/videos/PlatformFilter/PlatformFilter";
import PlatformPromo from "../../components/dashboard/videos/PlatformPromo/PlatformPromo";

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <FeaturedVideo />
      <Stats />
      <VideoShowcase />
      <PlatformFilter />
      <PlatformPromo />

      {/* <div
        style={{
          display: "flex",
          gap: "24px",
          padding: "32px 40px",
        }}
      >
        <PaymentSection />
        <PlansSection />
      </div> */}
    </div>
  );
};

export default Dashboard;