import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { selectMoimPost, clickPosts, clickInterest, clickJoin, deleteInterest } from '../../store/slices/moimSlice';
import { RootState, AppDispatch } from '../../store/store';
import { Bungae } from '../../store/slices/bungaeSlice';
import Swal from "sweetalert2";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaHeart, FaUser } from "react-icons/fa";
import { deleteMoimCardApi } from '../../utils/api';

// Styled components
const Card = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  margin: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: #ffffff;
`;

const ImageGalleryWrapper = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const GalleryImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 10px;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 20px;
  align-items: flex-start;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const InfoLeft = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Title = styled.h2`
  font-size: 24px;
  margin: 0;
`;

const SubInfo = styled.p`
  font-size: 14px;
  color: #666;
  margin: 5px 0;
`;

const KeywordButton = styled.button`
  background-color: #7848f4;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  margin-top: 10px;
  cursor: pointer;

  &:hover {
    background-color: #5c3bbf;
  }
`;

const HeartInterestsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const HeartIcon = styled(FaHeart)<{ interested: boolean }>`
  font-size: 20px;
  color: ${({ interested }) => (interested ? "red" : "gray")};
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: red;
  }
`;

const InterestandParticipantContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`;

const InterestCount = styled.p`
  margin: 0 10px;
  font-size: 16px;
  display: flex;
  align-items: center;

  svg {
    margin-right: 5px;
  }
`;

const ParticipantsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
`;

const ParticipantImages = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 5px;

  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const HostSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  position: relative;
`;

const HostInfo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const HostImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 10px;
`;

const HostDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const HostName = styled.p`
  font-size: 16px;
  font-weight: bold;
  margin: 0;
`;

const HostBio = styled.p`
  font-size: 14px;
  color: #666;
  margin: 5px 0;
`;

const ModalOverlay = styled.div<{ show: boolean }>`
  display: ${({ show }) => (show ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  width: 90%;
  max-width: 400px;
`;

const ModalTitle = styled.h3`
  margin-top: 0;
  color: #7848f4;
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
`;

const DropdownItem = styled.div`
  padding: 10px;
  cursor: pointer;
  text-align: center;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const JoinButton = styled.button<{ quit?: boolean }>`
  background-color: ${({ quit }) => (quit ? "#f44336" : "#7848f4")};
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: ${({ quit }) => (quit ? "#d32f2f" : "#5c3bbf")};
  }
`;

const EditButton = styled(JoinButton)`
  background-color: #4caf50;
`;

const DeleteButton = styled(JoinButton)`
  background-color: #f44336;
`;

const Divider = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px solid #eee;
  margin: 20px 0;
`;

const ContentSection = styled.div`
  width: 100%;
  height: auto;
  overflow: hidden;
`;

const AdditionalInfo = styled.div`
  width: 100%;
  padding: 20px;
  margin-top: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;

  h3 {
    color: #7848f4;
    font-weight: bold;
    margin-bottom: 10px;
  }

  p {
    font-size: 14px;
    margin: 5px 0;
  }
`;

const MoimCard = () => {
  const [eventInfo, setEventInfo] = useState<Bungae | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const moimId = id ? parseInt(id, 10) : 0;
  const error = useSelector((state: RootState) => state.bungae.error);
  const loading = useSelector((state: RootState) => state.bungae.loading);
  const userId = Number(localStorage.getItem('userId')) || 0;
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(clickPosts(moimId)).unwrap();
        setEventInfo(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [dispatch, moimId]);

  const handleInterest = async () => {
    if (userId === 0) {
      Swal.fire('Unauthorized', 'Please login to interact with this post', 'error');
      return;
    }
    if (eventInfo) {
      try {
        const response = await dispatch(clickInterest({ moimId: eventInfo.id, userId })).unwrap();
        setEventInfo({
          ...eventInfo,
          interested: true,
          interestsCount: eventInfo.interestsCount + 1,
        });
      } catch (error) {
        Swal.fire('error', 'Failed to toggle interest', 'error');
      }
    }
  };

  const handleDeleteInterest = async () => {
    if (userId === 0) {
      Swal.fire('Unauthorized', 'Please login to interact with this post', 'error');
      return;
    }
    if (eventInfo) {
      try {
        const response = await dispatch(deleteInterest({ moimId: eventInfo.id, userId })).unwrap();
        setEventInfo({
          ...eventInfo,
          interested: false,
          interestsCount: Math.max(eventInfo.interestsCount - 1, 0),
        });
      } catch (error) {
        Swal.fire('error', 'Failed to remove interest', 'error');
      }
    }
  };

  const handleJoin = async () => {
    if (userId === 0) {
      Swal.fire('Unauthorized', 'Please login to interact with this post', 'error');
      return;
    }
    if (eventInfo) {
      try {
        const response = await dispatch(clickJoin({ moimId: eventInfo.id, userId })).unwrap();
        setEventInfo({
          ...eventInfo,
          joined: true,
          participantsCount: eventInfo.participantsCount + 1,
        });
      } catch (error) {
        Swal.fire('error', 'Failed to join the event', 'error');
      }
    }
  };

  const handleQuitJoin = async () => {
    if (userId === 0) {
      Swal.fire('Unauthorized', 'Please login to interact with this post', 'error');
      return;
    }
    if (eventInfo) {
      try {
        const response = await dispatch(clickJoin({ moimId: eventInfo.id, userId })).unwrap();
        setEventInfo({
          ...eventInfo,
          joined: false,
          participantsCount: Math.max(eventInfo.participantsCount - 1, 0),
        });
      } catch (error) {
        Swal.fire('error', 'Failed to quit the event', 'error');
      }
    }
  };

  const handleEdit = () => {
    navigate('/moim/edit/' + String(moimId));
  };

  const handleDelete = async () => {
    const response = await deleteMoimCardApi(moimId);
    if (response.status === 200 || response.status === 201) {
      Swal.fire('Deleted', 'The post has been deleted', 'success');
      navigate('/moim/list');
    } else {
      Swal.fire('Failed', 'Failed to delete the post', 'error');
    }
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleUserInfoClick = () => {
    if (eventInfo) {
      navigate(`/user/${eventInfo.hostId}`);
    }
  };

  const handleUserPostsClick = () => {
    if (eventInfo) {
      navigate(`/usercreatedMoim/${eventInfo.hostId}`);
    }
  };

  return (
    <Card>
      {eventInfo ? (
        <>
          <ImageGalleryWrapper>
            <Slider {...sliderSettings}>
              {eventInfo?.imageUrls && eventInfo.imageUrls.map((image, index) => (
                <GalleryImage
                  key={index}
                  src={image}
                  alt={`Event Image ${index}`}
                />
              ))}
            </Slider>
          </ImageGalleryWrapper>
          <InfoSection>
            <InfoLeft>
              <Title>{eventInfo.title}</Title>
              <SubInfo>
                모집기간: {eventInfo.createdAt} ~ {eventInfo.expireAt}
              </SubInfo>
              <SubInfo>
                장소: {eventInfo.address.city}, {eventInfo.address.gu},{" "}
                {eventInfo.address.details}
              </SubInfo>
              <KeywordButton>{eventInfo.keyword}</KeywordButton>
            </InfoLeft>
            <InterestandParticipantContainer>
              <HeartInterestsContainer>
                <HeartIcon
                  interested={eventInfo.interested}
                  onClick={eventInfo.interested ? handleDeleteInterest : handleInterest}
                />
                <InterestCount>{eventInfo.interestsCount}</InterestCount>
                <ParticipantsContainer>
                  <FaUser />
                  <InterestCount>{eventInfo.participantsCount}</InterestCount>
                </ParticipantsContainer>
              </HeartInterestsContainer>
              <ParticipantImages>
                {eventInfo.participantsImageUrls && eventInfo.participantsImageUrls.slice(0, 6).map((url, index) => (
                  <img key={index} src={url} alt={`participant-${index}`} />
                ))}
              </ParticipantImages>
            </InterestandParticipantContainer>
          </InfoSection>
          <Divider />
          <ContentSection>
            <p>{eventInfo.content}</p>
          </ContentSection>
          <Divider />
          <HostSection>
            <HostInfo onClick={toggleModal}>
              <HostImage src={eventInfo.hostProfileImageUrl} alt="Host" />
              <HostDetails>
                <HostName>{eventInfo.hostName}</HostName>
                <HostBio>{eventInfo.hostIntro}</HostBio>
              </HostDetails>
            </HostInfo>
            {userId === eventInfo.hostId ? (
              <ButtonGroup>
                <EditButton onClick={handleEdit}>Edit</EditButton>
                <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
              </ButtonGroup>
            ) : (
              <JoinButton quit={eventInfo.joined} onClick={eventInfo.joined ? handleQuitJoin : handleJoin}>
                {eventInfo.joined ? "Quit" : "Join"}
              </JoinButton>
            )}
          </HostSection>
          <Divider />

          <ModalOverlay show={modalVisible} onClick={toggleModal} />
          {modalVisible && (
            <ModalContent>
              <ModalCloseButton onClick={toggleModal}>&times;</ModalCloseButton>
              <ModalTitle>유저 조회</ModalTitle>
              <DropdownItem onClick={handleUserInfoClick}>
                유저 정보 조회
              </DropdownItem>
              <DropdownItem onClick={handleUserPostsClick}>
                유저 작성 글
              </DropdownItem>
            </ModalContent>
          )}
        </>
      ) : error ? (
        <p>Error</p>
      ) : (
        <p>Loading...</p>
      )}
    </Card>
  );
};

export default MoimCard;
