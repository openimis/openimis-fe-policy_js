import React, { useState } from "react";
import { useTranslations, Autocomplete, useGraphqlQuery } from "@openimis/fe-core";

const PolicyOfficerPicker = (props) => {
  const {
    onChange,
    readOnly,
    required,
    withLabel = true,
    withPlaceholder,
    value,
    label,
    filterOptions,
    filterSelectedOptions,
    placeholder,
    extraFragment,
    multiple,
  } = props;
  const [searchString, setSearchString] = useState(null);
  const { formatMessage } = useTranslations("policy");

  const { isLoading, data, error } = useGraphqlQuery(
    `query PolicyOfficerPicker ($searchString: String, $first: Int) {
      policyOfficers(search: $searchString, first: $first) {
        edges {
          node {
            id
            uuid
            code
            lastName
            otherNames
            ${extraFragment ?? ""}
          } 
        }
      }
    }`,
    { searchString, first: 20 },
    { skip: true }
  );

  return (
    <Autocomplete
      multiple={multiple}
      required={required}
      placeholder={placeholder ?? formatMessage("PolicyOfficerPicker.placeholder")}
      label={label ?? formatMessage("PolicyOfficerPicker.label")}
      error={error}
      withLabel={withLabel}
      withPlaceholder={withPlaceholder}
      readOnly={readOnly}
      options={data?.policyOfficers?.edges.map((edge) => edge.node) ?? []}
      isLoading={isLoading}
      value={value}
      getOptionLabel={(option) => `${option.code} ${option.lastName} ${option.otherNames}`}
      onChange={(option) => onChange(option, option ? `${option.code} ${option.lastName} ${option.otherNames}` : null)}
      filterOptions={filterOptions}
      filterSelectedOptions={filterSelectedOptions}
      onInputChange={setSearchString}
    />
  );
};

export default PolicyOfficerPicker;
