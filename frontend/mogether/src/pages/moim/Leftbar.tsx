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
