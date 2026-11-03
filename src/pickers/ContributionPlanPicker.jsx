import React, { useState } from "react";
import { Autocomplete, useModulesManager, useTranslations } from "@openimis/fe-core";
import { CONTRIBUTION_PLAN_QUANTITY_LIMIT } from "../constants";
import { useContributionPlanQuery } from "../hooks";

const DEFAULT_FILTERS = {
  first: CONTRIBUTION_PLAN_QUANTITY_LIMIT,
  applyDefaultValidityFilter: true,
  isDeleted: false,
};

const contributionPlanLabel = (option) => `${option?.code ?? ""} ${option?.name ?? ""}`.trim();

const PolicyContributionPlanPicker = (props) => {
  const {
    multiple,
    required,
    placeholder,
    label,
    withLabel,
    withPlaceholder,
    readOnly,
    value,
    onChange,
    filter,
    filterSelectedOptions,
  } = props;

  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations("policy", modulesManager);

  // The options are only fetched once the picker is opened: `Autocomplete` calls
  // `onInputChange` on open, which sets the filters and triggers the query.
  const [filters, setFilters] = useState({ applyDefaultValidityFilter: true });
  const {
    isLoading,
    error,
    data: { contributionPlan },
  } = useContributionPlanQuery({ filters }, { skip: true });

  return (
    <Autocomplete
      multiple={multiple}
      required={required}
      error={error}
      placeholder={placeholder ?? formatMessage("ContributionPlanPicker.placeholder")}
      label={label ?? formatMessage("ContributionPlan")}
      withLabel={withLabel}
      withPlaceholder={withPlaceholder}
      readOnly={readOnly}
      options={contributionPlan ?? []}
      isLoading={isLoading}
      value={value}
      getOptionLabel={contributionPlanLabel}
      onChange={(selected) => onChange(selected, selected ? contributionPlanLabel(selected) : null)}
      filterOptions={filter}
      filterSelectedOptions={filterSelectedOptions}
      onInputChange={() => setFilters(DEFAULT_FILTERS)}
    />
  );
};

export default PolicyContributionPlanPicker;
