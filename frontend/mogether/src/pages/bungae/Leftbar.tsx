import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { filterPostsByKeywords } from "../../store/slices/moimSlice";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  VStack,
  useBreakpointValue,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Heading,
} from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";

const keywords = [
  "파티",
  "자기계발",
  "취미",
  "여행",
  "술",
  "음식",
  "스포츠",
  "액티비티",
  "게임",
  "문화",
  "스터디",
  "언어",
];

const LeftBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    keywords.reduce((acc, keyword) => ({ ...acc, [keyword]: false }), {})
  );
  const dispatch = useDispatch();
  const drawerSize = useBreakpointValue({ base: "full", md: "xs" });

  useEffect(() => {
    handleKeywordChange();
  }, [checkedItems]);

  const handleToggleChange = (key: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleKeywordChange = () => {
    const selectedKeywords = Object.keys(checkedItems).filter(
      (key) => checkedItems[key]
    );
    dispatch(filterPostsByKeywords(selectedKeywords));
  };

  return (
    <>
      <IconButton
        ref={btnRef}
        icon={<FaBars />}
        aria-label="Open filter menu"
        onClick={onOpen}
        position="fixed"
        top="20px"
        left="20px"
        zIndex={1000}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
        size={drawerSize}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Heading size="md" color="purple.500">
              Filters
            </Heading>
          </DrawerHeader>
          <DrawerBody>
            <VStack align="start" spacing={4}>
              {keywords.map((key) => (
                <Checkbox
                  key={key}
                  isChecked={checkedItems[key]}
                  onChange={() => handleToggleChange(key)}
                  size="lg"
                  colorScheme="purple"
                >
                  {key}
                </Checkbox>
              ))}
            </VStack>
            <Button
              colorScheme="purple"
              variant="solid"
              width="100%"
              mt={4}
              onClick={handleKeywordChange}
            >
              키워드 검색
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default LeftBar;

// import React, { useState, useEffect } from "react";
// import styled, { keyframes } from "styled-components";
// import { FaBars, FaTimes } from "react-icons/fa";
// import Toggle from "react-toggle";
// import "react-toggle"; 
// import { useDispatch } from "react-redux";
// import { filterPostsByKeywords } from '../../store/slices/moimSlice';

// const slideIn = keyframes`
//   from {
//     transform: translateX(-100%);
//   }
//   to {
//     transform: translateX(0);
//   }
// `;

// const slideOut = keyframes`
//   from {
//     transform: translateX(0);
//   }
//   to {
//     transform: translateX(-100%);
//   }
// `;

// const LeftBarContainer = styled.div<{ isOpen: boolean }>`
//   position: fixed;
//   top: 30%;
//   left: 0;
//   width: 200px;
//   height: 40%;
//   background-color: rgba(255, 255, 255, 0.8);
//   border-right: 2px solid #e0e0e0;
//   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//   padding: 20px;
//   box-sizing: border-box;
//   transform: translateX(${({ isOpen }) => (isOpen ? "0" : "-100%")});
//   animation: ${({ isOpen }) => (isOpen ? slideIn : slideOut)} 0.5s forwards;

//   @media (max-width: 768px) {
//     width: 30%;
//   }
// `;

// const MenuIcon = styled.div`
//   cursor: pointer;
//   font-size: 24px;
//   position: fixed;
//   top: 30%;
//   left: 0px;
//   z-index: 1000;
//   display: flex;
// `;

// const FilterContainer = styled.div`
//   margin-bottom: 20px;
// `;

// const FilterTitle = styled.h3`
//   margin-bottom: 10px;
//   color: #7848f4;
//   font-size: 18px;
// `;

// const FilterItem = styled.div`
//   display: flex;
//   align-items: center;
//   margin-bottom: 10px;

//   label {
//     margin-left: 10px;
//   }
// `;

// const StyledToggle = styled(Toggle)`
//   .react-toggle-track {
//     background-color: #7848f4;
//   }
//   .react-toggle-thumb {
//     border-color: #ffffff;
//   }
// `;

// const CheckButton = styled.button`
//   padding: 10px;
//   margin: 10px;
//   background-color: #7848f4;
//   color: #ffffff;
//   border: 2px solid #7848f4;
//   border-radius: 8px;
//   cursor: pointer;
//   font-size: 16px;
//   transition: background-color 0.3s, color 0.3s, transform 0.3s;

//   &:hover {
//     background-color: #5630c6;
//     color: #ffffff;
//   }
// `;

// const LeftBar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({
//     Art: true,
//     Music: true,
//     Travel: true,
//     Sports: true,
//   });
//   const dispatch = useDispatch();

//   useEffect(() => {
//     handleKeywordChange();
//   }, [checkedItems]);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleToggleChange = (key: string) => {
//     setCheckedItems((prev) => ({
//       ...prev,
//       [key]: !prev[key],  //true -> false, false -> true
//     }));
//   };

//   const handleKeywordChange = () => {
//     const selectedKeywords = Object.keys(checkedItems).filter((key) => checkedItems[key]);
//     dispatch(filterPostsByKeywords(selectedKeywords));
//   };

//   return (
//     <>
//       <MenuIcon onClick={toggleMenu}>
//         {isOpen ? <FaTimes /> : <FaBars />}
//       </MenuIcon>
//       <LeftBarContainer isOpen={isOpen}>
//         <FilterContainer>
//           <FilterTitle>Filters</FilterTitle>
//           {Object.keys(checkedItems).map((key) => (
//             <FilterItem key={key}>
//               <StyledToggle
//                 checked={checkedItems[key]}
//                 onChange={() => handleToggleChange(key)}
//               />
//               <label>{key}</label>
//             </FilterItem>
//           ))}
//         </FilterContainer>
//         <CheckButton onClick={handleKeywordChange}>키워드 검색</CheckButton>
//       </LeftBarContainer>
//     </>
//   );
// };

// export default LeftBar;
