const TOPIC_PANEL_MAP = {
  "DATA/PM/PANEL_LANTAI_1": "lantai_1",
  "DATA/PM/PANEL_LANTAI_2": "lantai_2",
  "DATA/PM/PANEL_LANTAI_3": "lantai_3",
};

const getAllTopics = () => {
  return Object.keys(TOPIC_PANEL_MAP);
};

const getPanelId = (topic) => {
  return TOPIC_PANEL_MAP[topic] || null;
};

export default {
  getAllTopics,
  getPanelId,
};
