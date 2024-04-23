import React, { useState, useEffect, useContext } from "react";
import { Badge, Box, Button, Flex, Heading, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, SimpleGrid, Stack, Text, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";

// Removed the hardcoded pokieGames array as the game data will now come from the backend API

import { MockAPIContext } from "../contexts/MockAPIContext";

const PokieCard = ({ pokie, played, isNew, isPopular, isPlaying, onPlay }) => {
  // playGame function is not used here, hence removed

  // ...

  // Update the onPlay function to also save the game to favorites and mark it as played
  // The handlePlay function is removed since it is redundant and the existing onPlay prop is used instead.
  const { name, description, image } = pokie;
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const hoverBgColor = useColorModeValue("orange.200", "orange.500");
  const boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";

  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" bg={bgColor} _hover={{ bg: hoverBgColor }}>
      <Image src={played ? "https://via.placeholder.com/150?text=Played" : image} alt={name} />
      <Box p="6" bg={bgColor} _hover={{ bg: hoverBgColor, boxShadow: boxShadow }} transition="background-color 0.3s, box-shadow 0.3s">
        // isNew and isPopular badges have been removed as they are no longer relevant
        <Heading size="md" my="2" color="orange.400">
          {name}
        </Heading>
        <Text mb="4">{played ? "You have played this game." : description}</Text>
        <Button rightIcon={<FaPlay />} colorScheme="orange" variant="solid" onClick={onPlay} isLoading={isPlaying} isDisabled={played} boxShadow="0 0 12px 3px rgba(255, 165, 0, 0.8)" aria-label={`Play ${name}`}>
          Play Now
        </Button>
      </Box>
    </Box>
  );
};

const Pokies = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedGame, setSelectedGame] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [filter, setFilter] = useState("all");
  const { favoriteGames, addGameToFavorites, playedGames, markGameAsPlayed } = useContext(MockAPIContext);
  const [filteredGames, setFilteredGames] = useState([]);

  useEffect(() => {
    fetchGames();
  }, []);

  const { games, fetchGames } = useContext(MockAPIContext);

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    if (games.length > 0) {
      if (filter === "all") {
        setFilteredGames(games);
      } else if (filter === "favorites") {
        setFilteredGames(games.filter((game) => favoriteGames.includes(game.name)));
      } else if (filter === "played") {
        setFilteredGames(games.filter((game) => playedGames.includes(game.name)));
      }
    }
  }, [games, filter, favoriteGames, playedGames]);

  useEffect(() => {
    if (games.length > 0) {
      if (filter === "all") {
        setFilteredGames(games);
      } else if (filter === "favorites") {
        setFilteredGames(games.filter((game) => favoriteGames.includes(game.name)));
      } else if (filter === "played") {
        setFilteredGames(games.filter((game) => playedGames.includes(game.name)));
      }
    }
  }, [games, filter, favoriteGames, playedGames]);

  // Update the handlePokiePlay function to correctly handle the asynchronous playGame function and not to add played games to favorites automatically
  const handlePokiePlay = async (pokie) => {
    try {
      setSelectedGame(pokie);
      setIsPlaying(true);
      onOpen();

      // Send a POST request to the new backend API to record the game play
      const response = await fetch("https://a.picoapps.xyz/view-race", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameName: pokie.name, result: "played" }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setIsPlaying(false);
      onClose();
      markGameAsPlayed(pokie.name);
    } catch (error) {
      console.error("Error playing game:", error);
    }
  };
  // ... rest of the Pokies component

  return (
    <>
      <Flex direction="column" align="center" justify="center" minH="100vh" p={4} bg="gray.800" color="white">
        <Heading mb={4} size="2xl" color="brand.800">
          Pokies
        </Heading>
        <Box mb={4}>
          <Text fontSize="xl">Total Games: {filteredGames.length}</Text>
          <RadioGroup onChange={setFilter} value={filter}>
            <Stack direction="row" mb={4}>
              <Radio value="all">All Games</Radio>
              <Radio value="favorites">Favorites</Radio>
              <Radio value="played">Played Games</Radio>
            </Stack>
          </RadioGroup>
        </Box>
        {filteredGames.length === 0 ? (
          <Text>Loading games...</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10}>
            {filteredGames.slice(0, 15).map((pokie) => (
              <PokieCard key={pokie.name} pokie={pokie} played={playedGames.includes(pokie.name)} isPlaying={isPlaying && selectedGame?.name === pokie.name} onPlay={() => handlePokiePlay(pokie)} />
            ))}
          </SimpleGrid>
        )}
      </Flex>
    </>
  );
};
export default Pokies;
