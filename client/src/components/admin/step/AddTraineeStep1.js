import React, { useRef, useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
  OutlinedInput,
  Chip,
} from "@mui/material";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import EmailValidation from "../../../utils/EmailValidation";
import PhoneValidation from "../../../utils/PhoneValidation";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
function AddTraineeStep1({ handleChange, handleInputData, listBatches, data }) {
  //for email validation
  const [validateMail, setValidateMail] = useState(true);
  const [emailTouched, setEmailTouched] = useState(false);
  const labelRef = useRef(null);
  const validationChange = async (e) => {
    const mail = e.target.value;
    setValidateMail(EmailValidation(mail));
    setEmailTouched(true);
  };

  //for phone validation
  const [validatePhone, setValidatePhone] = useState(true);
  const [phoneTouched, setPhoneTouched] = useState(false);

  const phoneValidationChange = async (e) => {
    const phone = e.target.value;
    setValidatePhone(PhoneValidation(phone));
    setPhoneTouched(true);
  };
  //shake effect
  const [shakeLabel, setShakeLabel] = useState(false);
  const handleEmailBlur = (e) => {
    const value = e.target.value.trim();
    setEmailTouched(true);
    const isValid = EmailValidation(value);
    setValidateMail(isValid);
    if (value === "" || !isValid) {
      setTimeout(() => {
        if (labelRef.current) {
          labelRef.current.classList.remove("label-shake");
          void labelRef.current.offsetWidth;
          labelRef.current.classList.add("label-shake");
          setTimeout(() => {
            labelRef.current.classList.remove("label-shake");
          }, 500);
        }
      }, 200);
    }
  };

  return (
    <ValidatorForm className="mt-7 grid grid-cols-2 gap-5">
      <div>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          sx={{ minHeight: "35px" }}
          id="outlined-basic"
          label="Full Name"
          name="trainee_name"
          onChange={handleChange}
          value={handleInputData.trainee_name}
        />
      </div>
      <div>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          sx={{ minHeight: "35px" }}
          id="outlined-basic"
          label="Email address"
          name="trainee_email_address"
          onChange={(e) => {
            handleChange(e);
            validationChange(e);
          }}
          value={handleInputData.trainee_email_address}
          onBlur={handleEmailBlur}
          error={
            emailTouched &&
            (handleInputData.trainee_email_address.trim() === "" ||
              validateMail === false)
          }
          className={shakeLabel ? "shake-label" : ""}
          helperText={
            emailTouched
              ? handleInputData.trainee_email_address.trim() === ""
                ? "Field should not be empty"
                : validateMail === false
                ? "Not a valid email."
                : "\u00A0"
              : "\u00A0"
          }
          // InputLabelProps={{
          //   ref: labelRef,
          // }}
        />
      </div>
      <div className="">
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          sx={{ minHeight: "35px" }}
          id="outlined-basic"
          label="Contact Number"
          onChange={(e) => {
            handleChange(e);
            phoneValidationChange(e);
          }}
          value={handleInputData.trainee_contact_address}
          name="trainee_contact_address"
          error={
            phoneTouched &&
            (handleInputData.trainee_contact_address.trim() === "" ||
              validatePhone === false)
          }
          helperText={
            phoneTouched
              ? handleInputData.trainee_contact_address.trim() === ""
                ? "Field should not be empty"
                : validatePhone === false
                ? "Not a valid phone."
                : "\u00A0"
              : "\u00A0"
          }
        />
      </div>
      <div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date of Birth"
            value={
              handleInputData.trainee_dob
                ? dayjs(handleInputData.trainee_dob)
                : null
            }
            onChange={(newValue) => {
              handleChange({
                target: {
                  name: "trainee_dob",
                  value: newValue ? newValue.format("YYYY-MM-DD") : "",
                },
              });
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: "outlined",
                size: "small",
                sx: { minHeight: "35px" },
              },
            }}
          />
        </LocalizationProvider>
      </div>
      <div className="">
        <FormControl
          fullWidth
          variant="outlined"
          size="small"
          sx={{ minHeight: "35px" }}
        >
          <InputLabel id="program-select-label">Select Gender</InputLabel>
          <Select
            labelId="program-select-label"
            onChange={handleChange}
            name="trainee_gender"
            value={handleInputData.trainee_gender}
            label="Select Gender"
            className=""
          >
            <MenuItem value={"male"}>Male</MenuItem>
            <MenuItem value={"female"}>Female</MenuItem>
            <MenuItem value={"prefer_not_to_say"}>Prefer not to say</MenuItem>
          </Select>
        </FormControl>
      </div>
      {data.people === "trainee" ? (
        <div className="">
          <FormControl
            fullWidth
            variant="outlined"
            size="small"
            sx={{ minHeight: "35px" }}
          >
            <InputLabel id="batch-select-label">Select Batch</InputLabel>
            <Select
              labelId="batch-select-label"
              onChange={handleChange}
              name="trainee_batch"
              value={handleInputData.trainee_batch}
              label="Select Batch"
            >
              {Array.isArray(listBatches) &&
                listBatches.map((obj) => (
                  <MenuItem key={obj.batch_id} value={obj.batch_id}>
                    {obj.batch_name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
      ) : (
        <div className="">
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="chip-select-label">Select Batches</InputLabel>
            <Select
              labelId="chip-select-label"
              multiple
              name="trainee_batch"
              value={handleInputData.trainee_batch}
              onChange={handleChange}
              input={<OutlinedInput label="Select Batches" />}
              renderValue={(selectedIds) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selectedIds.map((id) => {
                    const batch = listBatches.find((b) => b.batch_id === id);
                    return <Chip key={id} label={batch?.batch_name || id} />;
                  })}
                </Box>
              )}
            >
              {Array.isArray(listBatches) &&
                listBatches.map((obj) => (
                  <MenuItem key={obj.batch_id} value={obj.batch_id}>
                    {obj.batch_name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
      )}
    </ValidatorForm>
  );
}

export default AddTraineeStep1;