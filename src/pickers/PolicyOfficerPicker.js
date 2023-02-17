import React, { useState } from "react";
import {
  useTranslations,
  Autocomplete,
  useGraphqlQuery,
} from "@openimis/fe-core";

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
    filters,
    villageId,
  } = props;
  const [searchString, setSearchString] = useState(null);
  const { formatMessage } = useTranslations("policy");

  let distinctId = null;
  let regionId = null;
  if (filters?.location_0?.filter) {
    if (filters?.location_0?.filter)
      distinctId = filters?.location_0?.filter.replace(/^\D+/g, "");
    if (filters?.location_1?.filter)
      regionId = filters?.location_1?.filter.replace(/^\D+/g, "");
  } else {
    distinctId = villageId;
  }

  const { isLoading, data, error } = useGraphqlQuery(
    `query PolicyOfficerPicker ($searchString: String, $first: Int, $district: String, $region: String) {
      policyOfficers(search: $searchString, first: $first, district: $district, region: $region) {
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
    { searchString, first: 20, district: distinctId, region: regionId },
    { skip: true }
  );

  return (
    <Autocomplete
      multiple={multiple}
      required={required}
      placeholder={
        placeholder ?? formatMessage("PolicyOfficerPicker.placeholder")
      }
      label={label ?? formatMessage("PolicyOfficerPicker.label")}
      error={error}
      withLabel={withLabel}
      withPlaceholder={withPlaceholder}
      readOnly={readOnly}
      options={data?.policyOfficers?.edges.map((edge) => edge.node) ?? []}
      isLoading={isLoading}
      value={value}
      getOptionLabel={(option) =>
        `${option.code} ${option.lastName} ${option.otherNames}`
      }
      onChange={(option) =>
        onChange(
          option,
          option
            ? `${option.code} ${option.lastName} ${option.otherNames}`
            : null
        )
      }
      filterOptions={filterOptions}
      filterSelectedOptions={filterSelectedOptions}
      onInputChange={setSearchString}
    />
  );
};

export default PolicyOfficerPicker;
