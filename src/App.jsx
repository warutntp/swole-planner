import { useState } from "react";
import HeroSection from "./components/HeroSection";
import WorkoutGenerator from "./components/WorkoutGenerator";
import WorkoutSection from "./components/WorkoutSection";
import { createWorkoutPlan } from "./utils/workoutUtils";

const App = () => {
  const [workout, setWorkout] = useState(null);
  const [workoutType, setWorkoutType] = useState("individual");
  const [muscles, setMuscles] = useState([]);
  const [goal, setGoal] = useState("strength_power");

  const updateWorkout = () => {
    if (muscles.length < 1) {
      return;
    }
    const newWorkout = createWorkoutPlan({
      poison: workoutType,
      muscles,
      goal,
    });
    setWorkout(newWorkout);

    document.getElementById("workout").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-r from-slate-800 to-slate-950 text-white text-sm sm:text-base">
      <HeroSection />
      <WorkoutGenerator
        workoutType={workoutType}
        setWorkoutType={setWorkoutType}
        muscles={muscles}
        setMuscles={setMuscles}
        goal={goal}
        setGoal={setGoal}
        updateWorkout={updateWorkout}
      />
      {workout && <WorkoutSection workout={workout} />}
    </main>
  );
};

export default App;
