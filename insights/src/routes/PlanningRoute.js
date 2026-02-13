import Planning from "../layouts/operations/planning/Planning.layout";

const PlanningRoute = {
  path: "/app",
  title: "IABOT",
  pageTitle: "IABOT",
  component: Planning,
  children: [
    {
      title: "IABOT",
      pageTitle: "IABOT",
      link: "/app",
      component: Planning,
    },
  ],
};

export default PlanningRoute;
