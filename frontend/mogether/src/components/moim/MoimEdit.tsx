import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import styled from "styled-components";
import Swal from "sweetalert2";
import { SingleDatePicker, DateRangePicker, FocusedInputShape } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import "react-dates/initialize";
import {locations} from "../../utils/location";   //명명된 내보내기(export const)와 기본 내보내기(export default const)의 차이
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { createMoim, createBungae } from '../../store/slices/userSlice';
import { RootState, AppDispatch } from '../../store/store';
import { fetchProfile } from '../../store/slices/userSlice';
import { selectIsAuthenticated } from "../../store/slices/authSlice";
import { useNavigate } from 'react-router-dom';
import moment from "moment";

const PostCreateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 900px;
  margin: auto;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const Label = styled.label`
  font-weight: bold;
  margin-right: 5px;
  display: flex;
  align-items: center;
`;

const RequiredIcon = styled.span`
  color: red;
  margin-left: 5px;
`;

const Input = styled.input`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
`;

const Textarea = styled.textarea`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
  font-size: 16px;
  height: 100px;
  resize: none;
`;

const Select = styled.select`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
  font-size: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
  margin-top: 10px;
`;

const Button = styled.button<{ selected: boolean }>`
  padding: 10px 20px;
  background-color: ${({ selected }) => (selected ? "#7848f4" : "#ffffff")};
  color: ${({ selected }) => (selected ? "#ffffff" : "#000000")};
  border: 2px solid #7848f4;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #7848f4;
    color: #ffffff;
  }
`;

const ImageUpload = styled.input`
  margin: 10px 0;
`;

const ImagePreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 10px 0;
`;

const ImagePreview = styled.div`
  position: relative;
  width: 100px;
  height: 100px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
  }

  button {
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.8);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    padding: 2px 5px;
  }
`;

const NoteContainer = styled.div`
  box-sizing: border-box;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
`;

const NoteTitle = styled.h3`
  margin-bottom: 10px;
  color: #7848f4;
  font-size: 18px;
`;

const StyledSingleDatePicker = styled(SingleDatePicker)`
  .SingleDatePickerInput__withBorder {
    border-radius: 8px;
    overflow: hidden;
    display: flex;
  }

  .DateInput_input {
    border-radius: 8px;
    padding: 10px;
    border: 1px solid #ccc;
  }

  .SingleDatePicker_picker {
    z-index: 1000;
  }
`;

const StyledDateRangePicker = styled(DateRangePicker)`
  .DateRangePickerInput {
    border-radius: 8px;
    overflow: hidden;
    display: flex;
  }

  .DateInput_input {
    border-radius: 8px;
    padding: 10px;
    border: 1px solid #ccc;
  }

  .DateRangePicker_picker {
    z-index: 1000;
  }
`;

const StyledButton = styled.button`
  padding: 10px;
  width: 70%;
  background-color: #7848f4;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  margin: 10px;

  transition: background-color 0.3s;

  &:hover {
    background-color: #5c3bbf;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const LocationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 70%;
  box-sizing: border-box;
  gap: 15px;
`;

const MoimEdit = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const userProfile = useSelector((state: RootState) => state.user.profile);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string | null>("moim");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [subLocation, setSubLocation] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ startDate: string | null, endDate: string | null }>({
    startDate: null,
    endDate: null,
  });
  const [recruitmentFocusedInput, setRecruitmentFocusedInput] = useState<FocusedInputShape | null>(null);
  const [meetingStartTime, setMeetingStartTime] = useState<string | null>(null);
  // const [meetingFocused, setMeetingFocused] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState({
    placeDetails: "",
    minMembers: "",
    maxMembers: "",
    ageLimit: "",
    fee: "",
    meetingPeriodStart: "",
    meetingPeriodEnd: "",
  });
  const [additionalFocusedInput, setAdditionalFocusedInput] = useState<FocusedInputShape | null>(null);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/Login');   //userProfile이 존재 x -> 가져옴
    }
  }, [dispatch, isAuthenticated]);

  const handleKeywordChange = useCallback((keyword: string) => {  //이전과 동일한 참조값이 반환될 경우 -> 리렌더 x
    setKeywords((prev) =>
      prev.includes(keyword)
        ? prev.filter((k) => k !== keyword)
        : [...prev, keyword]
    );
  }, []);

  const handleCategoryChange = useCallback((selectedCategory: string) => {
    setCategory(selectedCategory);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 4) {
      Swal.fire(
        "Error",
        "이미지는 최대 4개까지 업로드할 수 있습니다.",
        "error"
      );
      return;
    }

    const fileArray = Array.from(files || []);
    const newUrls = fileArray.map((file) => URL.createObjectURL(file));
    setImageUrls((prev) => [...prev, ...newUrls]);
  };

  const handleImageRemove = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (
      !title ||
      !content ||
      keywords.length === 0 ||
      !category ||
      !dateRange.startDate ||
      !dateRange.endDate ||
      !location ||
      !subLocation
    ) {
      Swal.fire("Error", "필수 입력 항목을 모두 입력해주세요.", "error");
      return;
    }

    const moimData = {
      userId: userProfile?.userId,
      title: title,
      content: content,
      keyword: keywords,
      images: imageUrls,
      address: {
        city: location,
        gu: subLocation,
        details: additionalInfo.placeDetails,
      },
      description: content,
      createdAt: dateRange.startDate,
      expireAt: dateRange.endDate,
    };
    const bungaeData = {
      userId: userProfile?.userId,
      title: title,
      content: content,
      keyword: keywords,
      images: imageUrls,
      address: {
        city: location,
        gu: subLocation,
        details: additionalInfo.placeDetails,
      },
      description: content,
      createdAt: dateRange.startDate,
      expireAt: dateRange.endDate,
      gatherAt: meetingStartTime
    };
    
    if (category === "moim") {
      try {
        const response = await dispatch(createMoim(moimData)).unwrap();
      }
      catch (error) {
        Swal.fire({
          icon: 'error',
          title: '게시글 생성 실패',
          text: '생성 중 오류가 발생했습니다. 다시 시도하세요.',
        });
        window.location.reload();
      }
    }
    else {
      try {
        const response = await dispatch(createBungae(bungaeData)).unwrap();
      }
      catch (error) {
        Swal.fire({
          icon: 'error',
          title: '게시글 생성 실패',
          text: '생성 중 오류가 발생했습니다. 다시 시도하세요.',
        });
        window.location.reload();
      }
    }


  };

  useEffect(() => {
    setSubLocation("");
  }, [location]);

  return (
    <PostCreateContainer>
      <h2>Create an Event</h2>
      <Form>
        <InputContainer>
          <Label>
            Title<RequiredIcon>*</RequiredIcon>
          </Label>
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </InputContainer>
        <Label>
          Description<RequiredIcon>*</RequiredIcon>
        </Label>
        <Textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div>
          <Label>
            Category<RequiredIcon>*</RequiredIcon>
          </Label>
          <ButtonGroup>
            {["bungae", "study", "gathering"].map((cat) => (
              <Button
                key={cat}
                selected={category === cat}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </Button>
            ))}
          </ButtonGroup>
        </div>
        {category === "bungae" && (
          <div>
            <Label>
              <FontAwesomeIcon
                icon={faCalendarAlt}
                style={{ marginRight: 5 }}
              />
              Meeting Start Time<RequiredIcon>*</RequiredIcon>
            </Label>
            <Datetime
              value={meetingStartTime || ""}  //왼쪽값이 false인 경우 -> 오른쪽값 반환
              onChange={(date) => setMeetingStartTime(date ? date.toString() : null)}
              inputProps={{ placeholder: "Select Date and Time" }}
              dateFormat="YYYY-MM-DD"
              timeFormat="HH:mm"
            />
          </div>
        )}
        <div>
          <Label>
            Keywords<RequiredIcon>*</RequiredIcon>
          </Label>
          <ButtonGroup>
            {["Art", "Music", "Travel", "Sports"].map((keyword) => (
              <Button
                key={keyword}
                selected={keywords.includes(keyword)}
                onClick={() => handleKeywordChange(keyword)}
              >
                {keyword}
              </Button>
            ))}
          </ButtonGroup>
        </div>
        <div>
          <Label>
            <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: 5 }} />
            모집 기간<RequiredIcon>*</RequiredIcon>
          </Label>
          <StyledDateRangePicker
            startDate={dateRange.startDate ? moment(dateRange.startDate) : null}
            startDateId="start_date_id"
            endDate={dateRange.endDate ? moment(dateRange.endDate) : null}
            endDateId="end_date_id"
            onDatesChange={({ startDate, endDate }) =>
              setDateRange({
                startDate: startDate ? startDate.format("YYYY-MM-DD") : null,
                endDate: endDate ? endDate.format("YYYY-MM-DD") : null,
              })
            }
            focusedInput={recruitmentFocusedInput}
            onFocusChange={(focusedInput) =>
              setRecruitmentFocusedInput(focusedInput)
            }
            displayFormat="YYYY/MM/DD"
            numberOfMonths={1}
            isOutsideRange={() => false}
          />
        </div>
        <LocationWrapper>
          <Select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">행정시를 선택하세요</option>
            {locations.map((loc) => (
              <option key={loc.name} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </Select>
          <Select
            value={subLocation}
            onChange={(e) => setSubLocation(e.target.value)}
            disabled={!location}
          >
            <option value="">행정구를 선택하세요</option>
            {location &&
              locations
                .find((loc) => loc.name === location)
                ?.subArea.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
          </Select>
        </LocationWrapper>
        <ImageUpload
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        <ImagePreviewContainer>
          {imageUrls.map((url, index) => (
            <ImagePreview key={index}>
              <img src={url} alt={`Preview ${index}`} />
              <button onClick={() => handleImageRemove(index)}>X</button>
            </ImagePreview>
          ))}
        </ImagePreviewContainer>
        <NoteContainer>
          <NoteTitle>Additional Information</NoteTitle>
          <Textarea
            placeholder="Place Details"
            value={additionalInfo.placeDetails}
            onChange={(e) =>
              setAdditionalInfo((prev) => ({
                ...prev,
                placeDetails: e.target.value,
              }))
            }
          />
          <Input
            type="number"
            placeholder="Min Members"
            value={additionalInfo.minMembers}
            onChange={(e) =>
              setAdditionalInfo((prev) => ({
                ...prev,
                minMembers: e.target.value,
              }))
            }
          />
          <Input
            type="number"
            placeholder="Max Members"
            value={additionalInfo.maxMembers}
            onChange={(e) =>
              setAdditionalInfo((prev) => ({
                ...prev,
                maxMembers: e.target.value,
              }))
            }
          />
          <Input
            type="text"
            placeholder="Age Limit"
            value={additionalInfo.ageLimit}
            onChange={(e) =>
              setAdditionalInfo((prev) => ({
                ...prev,
                ageLimit: e.target.value,
              }))
            }
          />
          <Input
            type="text"
            placeholder="Fee"
            value={additionalInfo.fee}
            onChange={(e) =>
              setAdditionalInfo((prev) => ({
                ...prev,
                fee: e.target.value,
              }))
            }
          />
          <div>
            <Label>
              <FontAwesomeIcon
                icon={faCalendarAlt}
                style={{ marginRight: 5 }}
              />
              Meeting Period<RequiredIcon>*</RequiredIcon>
            </Label>
            <StyledDateRangePicker
              startDate={additionalInfo.meetingPeriodStart ? moment(additionalInfo.meetingPeriodStart) : null}
              startDateId="meeting_period_start_id"
              endDate={additionalInfo.meetingPeriodEnd ? moment(additionalInfo.meetingPeriodEnd) : null}
              endDateId="meeting_period_end_id"
              onDatesChange={({ startDate, endDate }) =>
                setAdditionalInfo((prev) => ({
                  ...prev,
                  meetingPeriodStart: startDate ? startDate.format("YYYY-MM-DD") : "",
                  meetingPeriodEnd: endDate ? endDate.format("YYYY-MM-DD") : "",
                }))
              }
              focusedInput={additionalFocusedInput}
              onFocusChange={(focusedInput) =>
                setAdditionalFocusedInput(focusedInput)
              }
              displayFormat="YYYY/MM/DD"
              numberOfMonths={1}
              isOutsideRange={() => false}
            />
          </div>
        </NoteContainer>
      </Form>
      <StyledButton onClick={handleSubmit}>Submit</StyledButton>
    </PostCreateContainer>
  );
};

export default MoimEdit;
