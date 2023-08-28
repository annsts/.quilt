import { questions } from '../constant';

export function getRandomQuestion(question) {
  const randomIndex = Math.floor(Math.random() * questions.length);
  const randomQuestion = questions[randomIndex];

  if (randomQuestion === question) return getRandomQuestion(question);

  return randomQuestion;
}
