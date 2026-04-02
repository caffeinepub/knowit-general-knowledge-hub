import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

actor {
  type Category = { #science; #history; #geography; #technology; #nature };

  type Difficulty = { #easy; #medium; #hard };

  type TriviaQuestion = {
    question : Text;
    options : [Text];
    correctAnswerIndex : Nat;
    category : Category;
    difficulty : Difficulty;
    timesAttempted : Nat;
  };

  module TriviaQuestion {
    public func compare(question1 : TriviaQuestion, question2 : TriviaQuestion) : Order.Order {
      Text.compare(question1.question, question2.question);
    };
  };

  type FunFact = {
    title : Text;
    description : Text;
    category : Category;
  };

  module FunFact {
    public func compare(fact1 : FunFact, fact2 : FunFact) : Order.Order {
      Text.compare(fact1.title, fact2.title);
    };
  };

  let triviaQuestions = Map.empty<Nat, TriviaQuestion>();
  let funFacts = Map.empty<Nat, FunFact>();

  var nextTriviaId = 17;
  var nextFunFactId = 9;

  // Helper functions
  func categoryToText(category : Category) : Text {
    switch (category) {
      case (#science) { "Science" };
      case (#history) { "History" };
      case (#geography) { "Geography" };
      case (#technology) { "Technology" };
      case (#nature) { "Nature" };
    };
  };

  func difficultyToText(difficulty : Difficulty) : Text {
    switch (difficulty) {
      case (#easy) { "Easy" };
      case (#medium) { "Medium" };
      case (#hard) { "Hard" };
    };
  };

  func getTriviaInternal(id : Nat) : TriviaQuestion {
    switch (triviaQuestions.get(id)) {
      case (null) { Runtime.trap("Question does not exist") };
      case (?question) { question };
    };
  };

  // Add Trivia Question
  public shared ({ caller }) func addTriviaQuestion(question : Text, options : [Text], correctAnswerIndex : Nat, category : Category, difficulty : Difficulty) : async Nat {
    let newQuestion : TriviaQuestion = {
      question;
      options;
      correctAnswerIndex;
      category;
      difficulty;
      timesAttempted = 0;
    };
    triviaQuestions.add(nextTriviaId, newQuestion);
    let id = nextTriviaId;
    nextTriviaId += 1;
    id;
  };

  // Add Fun Fact
  public shared ({ caller }) func addFunFact(title : Text, description : Text, category : Category) : async Nat {
    let newFunFact : FunFact = {
      title;
      description;
      category;
    };
    funFacts.add(nextFunFactId, newFunFact);
    let id = nextFunFactId;
    nextFunFactId += 1;
    id;
  };

  // Get all categories
  public query ({ caller }) func getCategories() : async [Text] {
    [
      "Science",
      "History",
      "Geography",
      "Technology",
      "Nature",
    ];
  };

  // Get question by ID
  public query ({ caller }) func getTrivia(id : Nat) : async TriviaQuestion {
    getTriviaInternal(id);
  };

  // Get all questions
  public query ({ caller }) func getAllQuestions() : async [TriviaQuestion] {
    triviaQuestions.values().toArray().sort();
  };

  // Get questions by category
  public query ({ caller }) func getQuestionsByCategory(category : Category) : async [TriviaQuestion] {
    triviaQuestions.values().toArray().filter(func(q) { q.category == category });
  };

  // Get all fun facts
  public query ({ caller }) func getAllFunFacts() : async [FunFact] {
    funFacts.values().toArray().sort();
  };

  // Get fun facts by category
  public query ({ caller }) func getFunFactsByCategory(category : Category) : async [FunFact] {
    funFacts.values().toArray().filter(func(f) { f.category == category });
  };

  // Get fun fact by ID
  public query ({ caller }) func getFunFact(id : Nat) : async FunFact {
    switch (funFacts.get(id)) {
      case (null) { Runtime.trap("Fact does not exist") };
      case (?fact) { fact };
    };
  };

  // Increment question attempts
  public shared ({ caller }) func incrementQuestionAttempts(id : Nat) : async () {
    let question = getTriviaInternal(id);
    let updatedQuestion = {
      question with
      timesAttempted = question.timesAttempted + 1;
    };
    triviaQuestions.add(id, updatedQuestion);
  };

  // Get random fun fact
  public query ({ caller }) func getRandomFunFact() : async ?FunFact {
    let count = funFacts.size();
    if (count == 0) { return null };
    let timestamp = Time.now();
    let index = Int.abs(timestamp) % count;
    let ids = funFacts.keys().toArray();
    let factId = ids[index];
    funFacts.get(factId);
  };

  // Get daily trivia question
  public query ({ caller }) func getDailyTrivia() : async ?TriviaQuestion {
    let count = triviaQuestions.size();
    if (count == 0) { return null };
    let day = Int.abs(Time.now()) / 86_400_000_000_000;
    let index = day % count;
    let ids = triviaQuestions.keys().toArray();
    let questionId = ids[index];
    triviaQuestions.get(questionId);
  };

  // Get all difficulties
  public query ({ caller }) func getDifficulties() : async [Text] {
    ["Easy", "Medium", "Hard"];
  };

  func toTriviaQuestion(question : TriviaQuestion) : TriviaQuestion {
    question;
  };

  func toFunFact(fact : FunFact) : FunFact {
    fact;
  };

  // Get all questions with answers hidden
  public query ({ caller }) func getAllQuestionsNoAnswers() : async [TriviaQuestion] {
    triviaQuestions.values().toArray().sort().map(toTriviaQuestion);
  };

  // Get questions by difficulty
  public query ({ caller }) func getQuestionsByDifficulty(difficulty : Difficulty) : async [TriviaQuestion] {
    triviaQuestions.values().toArray().filter(func(q) { q.difficulty == difficulty });
  };

  // Get total number of trivia questions
  public query ({ caller }) func getTotalQuestionsCount() : async Nat {
    triviaQuestions.size();
  };

  // Get total number of fun facts
  public query ({ caller }) func getTotalFunFactsCount() : async Nat {
    funFacts.size();
  };

  // Pre-seeded data
  // Trivia Questions
  let initialQuestions : [(Nat, TriviaQuestion)] = [
    (
      1,
      {
        question = "What is the chemical symbol for water?";
        options = ["CO2", "O2", "H2O", "NaCl"];
        correctAnswerIndex = 2;
        category = #science;
        difficulty = #easy;
        timesAttempted = 0;
      },
    ),
    (
      2,
      {
        question = "Who was the first President of the United States?";
        options = ["Thomas Jefferson", "Abraham Lincoln", "George Washington", "John Adams"];
        correctAnswerIndex = 2;
        category = #history;
        difficulty = #easy;
        timesAttempted = 0;
      },
    ),
    (
      3,
      {
        question = "What is the largest continent on Earth?";
        options = ["Africa", "Europe", "Asia", "North America"];
        correctAnswerIndex = 2;
        category = #geography;
        difficulty = #easy;
        timesAttempted = 0;
      },
    ),
    (
      4,
      {
        question = "Which planet is known as the Red Planet?";
        options = ["Venus", "Mars", "Jupiter", "Mercury"];
        correctAnswerIndex = 1;
        category = #science;
        difficulty = #easy;
        timesAttempted = 0;
      },
    ),
    (
      5,
      {
        question = "Who invented the telephone?";
        options = ["Thomas Edison", "Nikola Tesla", "Alexander Graham Bell", "Benjamin Franklin"];
        correctAnswerIndex = 2;
        category = #technology;
        difficulty = #medium;
        timesAttempted = 0;
      },
    ),
    (
      6,
      {
        question = "What is the capital of Australia?";
        options = ["Sydney", "Melbourne", "Brisbane", "Canberra"];
        correctAnswerIndex = 3;
        category = #geography;
        difficulty = #medium;
        timesAttempted = 0;
      },
    ),
    (
      7,
      {
        question = "In what year did the Titanic sink?";
        options = ["1912", "1922", "1902", "1892"];
        correctAnswerIndex = 0;
        category = #history;
        difficulty = #medium;
        timesAttempted = 0;
      },
    ),
    (
      8,
      {
        question = "What is the main component of natural gas?";
        options = ["Methane", "Propane", "Butane", "Ethane"];
        correctAnswerIndex = 0;
        category = #nature;
        difficulty = #hard;
        timesAttempted = 0;
      },
    ),
    (
      9,
      {
        question = "Who discovered penicillin?";
        options = ["Marie Curie", "Alexander Fleming", "Louis Pasteur", "Isaac Newton"];
        correctAnswerIndex = 1;
        category = #science;
        difficulty = #hard;
        timesAttempted = 0;
      },
    ),
    (
      10,
      {
        question = "What is the oldest university in the world?";
        options = ["University of Oxford", "University of Bologna", "University of Paris", "Al Quaraouiyine University"];
        correctAnswerIndex = 3;
        category = #history;
        difficulty = #hard;
        timesAttempted = 0;
      },
    ),
  ];

  // Fun Facts
  let initialFunFacts : [(Nat, FunFact)] = [
    (
      1,
      {
        title = "Lightning";
        description = "Lightning strikes the Earth 8.6 million times per day.";
        category = #nature;
      },
    ),
    (
      2,
      {
        title = "Mount Everest";
        description = "Mount Everest grows about 4 millimeters higher every year.";
        category = #geography;
      },
    ),
    (
      3,
      {
        title = "Computer Mouse";
        description = "The first computer mouse was made of wood.";
        category = #technology;
      },
    ),
    (
      4,
      {
        title = "Honey";
        description = "Honey never spoils. Archaeologists have found edible honey in ancient Egyptian tombs.";
        category = #nature;
      },
    ),
    (
      5,
      {
        title = "Bananas";
        description = "Bananas are berries, but strawberries are not.";
        category = #science;
      },
    ),
    (
      6,
      {
        title = "Roman Numerals";
        description = "The number 0 does not exist in Roman numerals.";
        category = #history;
      },
    ),
    (
      7,
      {
        title = "Deepest Part of the Ocean";
        description = "The Mariana Trench is the deepest part of the world's oceans.";
        category = #geography;
      },
    ),
    (
      8,
      {
        title = "Longest Living Animal";
        description = "The Greenland shark can live for over 400 years.";
        category = #nature;
      },
    ),
  ];

  // Initialize persistent data structures with pre-seeded data
  for ((id, question) in initialQuestions.values()) {
    triviaQuestions.add(id, question);
  };

  for ((id, fact) in initialFunFacts.values()) {
    funFacts.add(id, fact);
  };
};
