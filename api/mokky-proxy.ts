export default async function handler(req, res) {
  console.log("Функция вызвана");
  res.status(200).json({ message: "Работает!" });
}