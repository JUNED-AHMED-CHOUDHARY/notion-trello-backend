import { ALERTS } from "../constants/alertEnums.js";

const config: any = {
  local: {
    slack: {
      [ALERTS.ALERT_TESTING]:
        "https://hooks.slack.com/services/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",
    },
  },
  production: {
    slack: {
      [ALERTS.ALERT_TESTING]:
        "https://hooks.slack.com/services/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",
    },
  },
};

export default config[process.env.NODE_ENV || "local"];
