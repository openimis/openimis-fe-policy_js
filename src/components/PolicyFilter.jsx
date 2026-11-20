import React, { Component } from "react";
import _debounce from "lodash/debounce";
import { styled } from "@mui/material/styles";
import { Checkbox, FormControlLabel, Grid } from "@mui/material";
import {
  withModulesManager,
  formatMessage,
  decodeId,
  Contributions,
  PublishedComponent,
  ControlledField,
  AmountInput,
  GRID_RESPONSIVE_STANDARD,
  GRID_RESPONSIVE_FULL,
  TextInput,
  injectIntl,
} from "@openimis/fe-core";

const StyledDialogTitle = styled("div")(({ theme }) => ({
  ...(theme?.dialog?.title ?? {}),
}));

const StyledDialogContent = styled("div")(({ theme }) => ({
  ...(theme?.dialog?.content ?? {}),
}));

const StyledForm = styled("div")(({ theme }) => ({
  padding: 0,
}));

const StyledItem = styled("div")(({ theme }) => ({
  padding: theme?.spacing?.(1),
}));

const StyledPaperDivider = styled("div")(({ theme }) => ({
  ...(theme?.paper?.divider ?? {}),
}));

const POLICY_FILTER_CONTRIBUTION_KEY = "policy.Filter";

class PolicyFilter extends Component {
  debouncedOnChangeFilter = _debounce(
    this.props.onChangeFilters,
    this.props.modulesManager.getConf("fe-policy", "debounceTime", 200)
  );

  _filterValue = (k) => {
    const { filters } = this.props;
    return !!filters && !!filters[k] ? filters[k].value : null;
  };

  _onChangeCheckbox = (key, value) => {
    let filters = [
      {
        id: key,
        value: value,
        filter: `${key}: ${value}`,
      },
    ];
    this.props.onChangeFilters(filters);
  };

  _onChangeRef = (k, v, s) => {
    let filters = [
      {
        id: k,
        value: v,
        filter: !v ? null : `${k}_Id: "${v.id}"`,
      },
    ];
    this.props.onChangeFilters(filters);
  };
  _filterTextFieldValue = (k) => {
    const { filters } = this.props;
    return !!filters && !!filters[k] ? filters[k].value : "";
  };
  renderLastNameField = () => {
    return (
      <ControlledField
        module="insuree"
        id="InsureeFilter.lastName"
        field={
          <Grid size={GRID_RESPONSIVE_STANDARD} component={StyledItem}>
            <TextInput
              module="insuree"
              label="Insuree.lastName"
              name="lastName"
              value={this._filterTextFieldValue("lastName")}
              onChange={(v) =>
                this.debouncedOnChangeFilter([
                  {
                    id: "lastName",
                    value: v,
                    filter: `insureePolicies_Insuree_LastName_Icontains: "${v}"`,
                  },
                ])
              }
            />
          </Grid>
        }
      />
    );
  };

  renderGivenNameField = () => {
    return (
      <ControlledField
        module="insuree"
        id="InsureeFilter.givenName"
        field={
          <Grid size={GRID_RESPONSIVE_STANDARD} component={StyledItem}>
            <TextInput
              module="insuree"
              label="Insuree.otherNames"
              name="givenName"
              value={this._filterTextFieldValue("givenName")}
              onChange={(v) =>
                this.debouncedOnChangeFilter([
                  {
                    id: "givenName",
                    value: v,
                    filter: `insureePolicies_Insuree_OtherNames_Icontains: "${v}"`,
                  },
                ])
              }
            />
          </Grid>
        }
      />
    );
  };

  render() {
    const { intl, filters, onChangeFilters } = this.props;
    return (
      <Grid container component={StyledForm}>
        <ControlledField
          module="policy"
          id="PolicyFilter.location"
          field={
            <Grid size={GRID_RESPONSIVE_FULL}>
              <PublishedComponent
                pubRef="location.DetailedLocationFilter"
                withNull={true}
                filters={filters}
                onChangeFilters={onChangeFilters}
                anchor="location"
                split
              />
            </Grid>
          }
        />
        <ControlledField
          module="policy"
          id="PolicyFilter.product"
          field={
            <Grid size={GRID_RESPONSIVE_STANDARD} component={StyledItem}>
              <PublishedComponent
                pubRef="product.ProductPicker"
                withNull={true}
                value={this._filterValue("product")}
                onChange={(v, s) => this._onChangeRef("product", v, s)}
                withLabel
                label={formatMessage(
                  intl,
                  "policy",
                  "PolicyFilter.product.label"
                )}
                withPlaceholder
                placeholder={formatMessage(
                  intl,
                  "policy",
                  "PolicyFilter.product.placeholder"
                )}
              />
            </Grid>
          }
        />
        <ControlledField
          module="policy"
          id="PolicyFilter.ConfirmationType"
          field={
            <Grid size={GRID_RESPONSIVE_STANDARD} component={StyledItem}>
              <PublishedComponent
                pubRef="insuree.ConfirmationTypePicker"
                withNull={true}
                nullLabel={formatMessage(
                  intl,
                  "insuree",
                  "Family.ConfirmationType.null"
                )}
                value={this._filterValue("confirmationType")}
                onChange={(k) => {
                  let filters = [
                    {
                      id: "confirmationType",
                      value: k,
                      filter: !k ? null : `confirmationType: "${k.code}"`,
                    },
                  ];
                  this.props.onChangeFilters(filters);
                }}
              />
            </Grid>
          }
        />
        <ControlledField
          module="policy"
          id="PolicyFilter.officer"
          field={
            <Grid size={GRID_RESPONSIVE_STANDARD} component={StyledItem}>
              <PublishedComponent
                pubRef="policy.PolicyOfficerPicker"
                withNull={true}
                filters={filters}
                value={this._filterValue("officer")}
                onChange={(v, s) => this._onChangeRef("officer", v, s)}
                withLabel
                label={formatMessage(
                  intl,
                  "policy",
                  "PolicyOfficerPicker.label"
                )}
                withPlaceholder
                placeholder={formatMessage(
                  intl,
                  "policy",
                  "PolicyOfficerPicker.placeholder"
                )}
              />
            </Grid>
          }
        />
        <ControlledField
          module="insuree"
          id="InsureeFilter.chfId"
          field={
            <Grid size={GRID_RESPONSIVE_STANDARD} component={StyledItem}>
              <TextInput
                module="insuree"
                label="Insuree.chfId"
                name="chfId"
                value={this._filterTextFieldValue("chfId")}
                onChange={(v) =>
                  this.debouncedOnChangeFilter([
                    {
                      id: "chfId",
                      value: v,
                      filter: `insureePolicies_Insuree_ChfId: "${v}"`,
                    },
                  ])
                }
              />
            </Grid>
          }
        />
        <>
          {this.renderGivenNameField()}
          {this.renderLastNameField()}
        </>
        {["enroll", "start", "effective", "expiry"].map((date) => (
          <ControlledField
            module="policy"
            id={`PolicyFilter.${date}Date`}
            key={`PolicyFilter.${date}Date`}
            field={
              <Grid size={GRID_RESPONSIVE_STANDARD}>
                <Grid container>
                  <Grid size={6} component={StyledItem}>
                    <PublishedComponent
                      pubRef="core.DatePicker"
                      value={
                        (filters[`${date}DateFrom`] &&
                          filters[`${date}DateFrom`]["value"]) ||
                        null
                      }
                      module="policy"
                      label={`PolicyFilter.${date}DateFrom`}
                      onChange={(d) =>
                        onChangeFilters([
                          {
                            id: `${date}DateFrom`,
                            value: d,
                            filter: !!d ? `${date}Date_Gte: "${d}"` : null,
                          },
                        ])
                      }
                    />
                  </Grid>
                  <Grid size={6} component={StyledItem}>
                    <PublishedComponent
                      pubRef="core.DatePicker"
                      value={
                        (filters[`${date}DateTo`] &&
                          filters[`${date}DateTo`]["value"]) ||
                        null
                      }
                      module="policy"
                      label={`PolicyFilter.${date}DateTo`}
                      onChange={(d) =>
                        onChangeFilters([
                          {
                            id: `${date}DateTo`,
                            value: d,
                            filter: !!d ? `${date}Date_Lte: "${d}"` : null,
                          },
                        ])
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
            }
          />
        ))}
        <ControlledField
          module="policy"
          id="PolicyFilter.type"
          field={
            <Grid size={GRID_RESPONSIVE_STANDARD} component={StyledItem}>
              <PublishedComponent
                pubRef="policy.PolicyStagePicker"
                withNull={true}
                value={this._filterValue("stage")}
                onChange={(s) =>
                  onChangeFilters([
                    {
                      id: "stage",
                      value: s,
                      filter: !!s ? `stage: "${s}"` : null,
                    },
                  ])
                }
              />
            </Grid>
          }
        />
        <ControlledField
          module="policy"
          id="PolicyFilter.status"
          field={
            <Grid size={GRID_RESPONSIVE_STANDARD} component={StyledItem}>
              <PublishedComponent
                pubRef="policy.PolicyStatusPicker"
                withNull={true}
                value={this._filterValue("status")}
                onChange={(s) =>
                  onChangeFilters([
                    {
                      id: "status",
                      value: s,
                      filter: !!s ? `status: ${s}` : null,
                    },
                  ])
                }
              />
            </Grid>
          }
        />
        {["balanceLte", "balanceGte"].map((b) => (
          <ControlledField
            module="policy"
            id="PolicyFilter.balanceUnder"
            key={b}
            field={
              <Grid size={GRID_RESPONSIVE_STANDARD} component={StyledItem}>
                <AmountInput
                  module="policy"
                  label={`PolicyFilter.${b}`}
                  value={filters[b] && filters[b]["value"]}
                  onChange={(v) =>
                    this.debouncedOnChangeFilter([
                      {
                        id: b,
                        value: !v ? null : v,
                        filter: !!v ? `${b}: ${v}` : null,
                      },
                    ])
                  }
                />
              </Grid>
            }
          />
        ))}
        <ControlledField
          module="policy"
          id="PolicyFilter.showInactive"
          field={
            <Grid size={GRID_RESPONSIVE_STANDARD} component={StyledItem}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={!!this._filterValue("showInactive")}
                    onChange={(event) =>
                      this._onChangeCheckbox(
                        "showInactive",
                        event.target.checked
                      )
                    }
                  />
                }
                label={formatMessage(
                  intl,
                  "policy",
                  "PolicyFilter.showInactive"
                )}
              />
            </Grid>
          }
        />
        <ControlledField
          module="policy"
          id="PolicyFilter.showHistory"
          field={
            <Grid size={GRID_RESPONSIVE_STANDARD} component={StyledItem}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={!!this._filterValue("showHistory")}
                    onChange={(event) =>
                      this._onChangeCheckbox(
                        "showHistory",
                        event.target.checked
                      )
                    }
                  />
                }
                label={formatMessage(
                  intl,
                  "policy",
                  "PolicyFilter.showHistory"
                )}
              />
            </Grid>
          }
        />
        <Contributions
          filters={filters}
          onChangeFilters={onChangeFilters}
          contributionKey={POLICY_FILTER_CONTRIBUTION_KEY}
        />
      </Grid>
    );
  }
}

export { StyledDialogTitle };
export { PolicyFilter };
export default withModulesManager(injectIntl(PolicyFilter));
