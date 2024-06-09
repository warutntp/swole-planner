import { useState } from "react";
import PropTypes from "prop-types";
import SectionWrapper from "./SectionWrapper";
import { SCHEMES, WORKOUTS } from "../utils/swoldier";
import Button from "./Button";

const Header = ({ index, title, description }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center gap-2">
        <p className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-400">
          {index}
        </p>
        <h4 className="text-xl sm:text-2xl md:text-3xl">{title}</h4>
      </div>
      <p className="text-sm sm:text-base mx-auto">{description}</p>
    </div>
  );
};

Header.propTypes = {
  index: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

const WorkoutGenerator = ({
  muscles,
  setMuscles,
  workoutType,
  setWorkoutType,
  goal,
  setGoal,
  updateWorkout,
}) => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const updateMuscles = (muscleGroup) => {
    if (muscles.includes(muscleGroup)) {
      setMuscles(muscles.filter((val) => val !== muscleGroup));
      return;
    }

    if (muscles.length > 2) {
      return;
    }

    if (workoutType !== "individual") {
      setMuscles([muscleGroup]);
      setShowModal(false);
      return;
    }

    setMuscles([...muscles, muscleGroup]);
    if (muscles.length === 2) {
      setShowModal(false);
    }
  };

  return (
    <SectionWrapper
      id={"generate"}
      header={"generate your workout"}
      title={["It's", "Huge", "o'clock"]}
    >
      <Header
        index={"01"}
        title={"Pick your poison"}
        description={"Select the workout you wish to endure."}
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.keys(WORKOUTS).map((type) => (
          <button
            onClick={() => {
              setMuscles([]);
              setWorkoutType(type);
            }}
            className={
              "bg-slate-950 border duration-200 px-4 hover:border-blue-600 py-3 rounded-lg " +
              (type === workoutType ? " border-blue-600" : " border-blue-400")
            }
            key={type}
            aria-label={type.replaceAll("_", " ")}
          >
            <p className="capitalize">{type.replaceAll("_", " ")}</p>
          </button>
        ))}
      </div>
      <Header
        index={"02"}
        title={"Lock on targets"}
        description={"Select the muscles judged for annihilation."}
      />
      <div className="bg-slate-950 border border-solid border-blue-400 rounded-lg flex flex-col">
        <button
          onClick={toggleModal}
          className="relative p-3 flex items-center justify-center"
          aria-expanded={showModal}
          aria-controls="muscle-group-options"
        >
          <p className="capitalize">
            {muscles.length === 0 ? "Select muscle groups" : muscles.join(" ")}
          </p>
          <i className="fa-solid absolute right-3 top-1/2 -translate-y-1/2 fa-caret-down"></i>
        </button>
        {showModal && (
          <div id="muscle-group-options" className="flex flex-col px-3 pb-3">
            {(workoutType === "individual"
              ? WORKOUTS[workoutType]
              : Object.keys(WORKOUTS[workoutType])
            ).map((muscleGroup) => (
              <button
                onClick={() => updateMuscles(muscleGroup)}
                key={muscleGroup}
                className={
                  "hover:text-blue-400 duration-200 " +
                  (muscles.includes(muscleGroup) ? " text-blue-400" : "")
                }
              >
                <p className="uppercase">{muscleGroup.replaceAll("_", " ")}</p>
              </button>
            ))}
          </div>
        )}
      </div>
      <Header
        index={"03"}
        title={"Become Juggernaut"}
        description={"Select your ultimate objective."}
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.keys(SCHEMES).map((scheme) => (
          <button
            onClick={() => setGoal(scheme)}
            className={
              "bg-slate-950 border duration-200 hover:border-blue-600 py-3 rounded-lg px-4 " +
              (scheme === goal ? " border-blue-600" : " border-blue-400")
            }
            key={scheme}
            aria-label={scheme.replaceAll("_", " ")}
          >
            <p className="capitalize">{scheme.replaceAll("_", " ")}</p>
          </button>
        ))}
      </div>
      <Button func={updateWorkout} text={"Formulate"} />
    </SectionWrapper>
  );
};

WorkoutGenerator.propTypes = {
  muscles: PropTypes.arrayOf(PropTypes.string).isRequired,
  setMuscles: PropTypes.func.isRequired,
  workoutType: PropTypes.string.isRequired,
  setWorkoutType: PropTypes.func.isRequired,
  goal: PropTypes.string.isRequired,
  setGoal: PropTypes.func.isRequired,
  updateWorkout: PropTypes.func.isRequired,
};

export default WorkoutGenerator;
