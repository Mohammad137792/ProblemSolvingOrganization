export const NOTE = "NOTE";
export const SET_EXAMINER = "SET_EXAMINER";

export const addNote = (note = "", writerPartyRelationshipId) => {
  return async (dispatch, getState) => {
    const medicalNote = [...getState().fadak.hseDoq.examiner.medicalNote];
    medicalNote.push({
      descriptionEnumId: "MNTHuman",
      writerPartyRelationshipId: writerPartyRelationshipId,
      description: note,
    });
    const tempExaminer = {
      ...getState().fadak.hseDoq.examiner,
      medicalNote: medicalNote,
    };
    const tempExaminers = [...getState().fadak.hseDoq.examiners];
    const examinerIndex = tempExaminers.findIndex(
      (exam) =>
        exam.partyRelationshipId ==
        getState().fadak.hseDoq.examiner.partyRelationshipId
    );
    tempExaminers[examinerIndex] = tempExaminer;
    await dispatch({
      type: NOTE,
      payload: {
        ...getState,
        examiners: tempExaminers,
        examiner: tempExaminer,
      },
    });
  };
};

export const setExaminer = (examiners, examinationProcess, examiner) => {
  return async (dispatch) => {
    await dispatch({
      type: SET_EXAMINER,
      payload: {
        examiners: examiners,
        examinationProcess: examinationProcess,
        examiner: examiner,
      },
    });
  };
};
