import React from "react";
import { useModulesManager, useTranslations } from "@openimis/fe-core";
import { Grid, Typography, Box } from "@material-ui/core";
import ThumbUp from "@material-ui/icons/ThumbUp";
import ThumbDown from "@material-ui/icons/ThumbDown";

const Thumb = (props) => {
  if (props.isOk) {
    return <ThumbUp />;
  } else {
    return <ThumbDown />;
  }
};

const Info = (props) => {
  return <Box mr={3}>{props.children}</Box>;
};

const Eligibility = (props) => {
  const { isOk, minDate, remaining } = props;
  const modulesManager = useModulesManager();
  const { formatMessageWithValues, formatDateFromISO } = useTranslations("policy", modulesManager);
  return (
    <Grid container>
      {!modulesManager.hideField("policy", "insureeEligibility.isOk") && (
        <Info>
          <Thumb isOk={isOk} />
        </Info>
      )}
      {!modulesManager.hideField("policy", "insureeEligibility.minDate") && minDate && (
        <Info>
          <Typography>
            {formatMessageWithValues("insureeEligibility.minDate", { date: formatDateFromISO(minDate) })}
          </Typography>
        </Info>
      )}
      {!modulesManager.hideField("policy", "insureeEligibility.left") && remaining !== null && (
        <Info>
          <Typography>{formatMessageWithValues("insureeEligibility.left", { count: remaining })}</Typography>
        </Info>
      )}
    </Grid>
  );
};

export default Eligibility;
