import React, { useState } from "react";

import { TextField } from "@material-ui/core";

import {
  useTranslations,
  Autocomplete,
  useGraphqlQuery,
} from "@openimis/fe-core";

const PaymentTypePicker = (props) => {
  const {
    onChange,
    readOnly,
    required,
    withLabel = false,
    withPlaceholder = false,
    value,
    label,
    filterOptions,
    filterSelectedOptions,
    placeholder,
    extraFragment,
    nullLabel,
    multiple,
    filters,
    villageId,
    types
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


  return (
    <Autocomplete
      multiple={multiple}
      required={required}
      readOnly={readOnly}
      options={types ?? []}
      value={value}
      getOptionLabel={(option) =>
        `${option.levelType} -  Level ${option.levelIndex} `
      }
      onChange={(option) =>
        onChange(
          option,
          option
            ? `${option.levelType} -  Level ${option.levelIndex} `
            : null
        )
      }
      filterOptions={filterOptions}
      filterSelectedOptions={filterSelectedOptions}
      onInputChange={setSearchString}
      renderInput={(inputProps) => (
        <TextField
          {...inputProps}
          required={required}
          label={
            (withLabel && (label || nullLabel)) ||
            formatMessage("PaymentTypePicker.label")
          }
          placeholder={
            (withPlaceholder && placeholder) ||
            formatMessage("PaymentTypePicker.placeholder")
          }
        />
      )}
    />
  );
};

export default PaymentTypePicker;
