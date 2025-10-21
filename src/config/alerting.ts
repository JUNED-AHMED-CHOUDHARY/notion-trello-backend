import { ALERTS } from "../constants/alertEnums.js";

const config: any = {
  local: {
    slack: {
      [ALERTS.ALERT_TESTING]:
        `https://hooks.slack.com/services/${process.env.SLACK_ALERT_SUFFIX}`,
    },
  },
  production: {
    slack: {
      [ALERTS.ALERT_TESTING]:
        `https://hooks.slack.com/services/${process.env.SLACK_ALERT_SUFFIX}`,
    },
  },
};

export default config[process.env.NODE_ENV || "local"];
