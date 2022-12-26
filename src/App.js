import { useEffect, useState } from "react";
import "./App.css";
import { Progress, Space, Steps, Typography, Input, Radio } from "antd";

const questions = [
  {
    name: "where",
    rus: "Куда вы хотите поставить солнечные панели?",
    eng: "Where do you want to put solar panels?",
    uzb: "Quyosh panellarini qayerga qo'ymoqchisiz?",
    options: [
      { name: "home", rus: "Домой", eng: "Home", uzb: "Uyga" },
      { name: "company", rus: "Предприятие", eng: "Company", uzb: "Kompaniya" },
    ],
  },
  {
    name: "why",
    rus: "Для чего вы хотите поставить?",
    eng: "For what you want to put for?",
    uzb: "Nima uchun o'rnatishni xohlaysiz?",
    options: [
      {
        name: "manyPowerOutages",
        rus: "Из-за проблем со электроэнергией, много отключают электроэнергию",
        eng: "Due to power problems, many power outages",
        uzb: "Elektr muammolari tufayli ko'plab elektr uzilishlari",
      },
      {
        name: "forInvestment",
        rus: "Для инвестиции",
        eng: "For investment",
        uzb: "Investitsiyalar uchun",
      },
      {
        name: "other",
        rus: "Свой ответ",
        eng: "Your answer",
        uzb: "Javobingiz",
      },
    ],
  },
  {
    name: "outageTimes",
    rus: "В какое время в днем или ночью у вас отключают электроэнергию, и на сколько часов?",
    eng: "What time of the day or night do you have a power outage, and for how many hours?",
    uzb: "Kun yoki tunning qaysi vaqtida elektr ta'minotida uzilishlar bo'ladi va necha soat?",
    options: [
      { name: "day", rus: "Днем", eng: "Day", uzb: "Kunduz" },
      { name: "night", rus: "Ночью", eng: "At night", uzb: "Tunda" },
      {
        name: "other",
        rus: "Свой ответ",
        eng: "Your answer",
        uzb: "Javobingiz",
      },
    ],
  },
  {
    name: "outageTimeLength",
    rus: "На сколько часов у вас отключают электроэнергию среднем в день?",
    eng: "How many hours do you have power cuts per day on average?",
    uzb: "Kuniga o'rtacha necha soat elektr uzilishi mumkin?",
    options: [
      { name: "2hours", rus: "2 часа", eng: "2 hours", uzb: "2 soat" },
      { name: "4hours", rus: "4 часа", eng: "4 hours", uzb: "4 soat" },
      { name: "6hours", rus: "6 часов", eng: "6 hours", uzb: "6 soat" },
      {
        name: "other",
        rus: "Свой ответ",
        eng: "Your answer",
        uzb: "Javobingiz",
      },
    ],
  },
  {
    name: "howMuchPay",
    rus: "Сколько вы платите, либо потребляете электроэнергию в среднем за один месяц?",
    eng: "How much do you pay or consume electricity on average per month?",
    uzb: "Oyiga o'rtacha qancha to'laysiz yoki elektr energiyasini iste'mol qilasiz?",
    options: [
      { name: "soum", rus: "Сум", eng: "Soum", uzb: "So'm" },
      { name: "kw", rus: "кВт", eng: "kW", uzb: "kVt" },
    ],
  },
];

function App() {
  const { Title, Text } = Typography;
  const [answers, setAnswers] = useState({
    where: "",
    why: "",
    outageTimes: "",
    outageTimeLength: null,
    howMuchCosts: "",
  });
  const [why, setWhy] = useState("");
  const [outageTimes, setOutageTimes] = useState("");
  const [outageTimeLength, setOutageTimeLength] = useState(null); // ответ на четвертый вопрос
  const [soum, setSoum] = useState(null);
  const [kw, setKw] = useState(null);

  const [Q, setQ] = useState(null);
  const [Y, setY] = useState(null);
  const [F, setF] = useState(null);
  const [T, setT] = useState(null);

  const [hybird, setHybird] = useState(0);
  const [ongrid, setOngrid] = useState(0);
  const [offgrid, setOffgrid] = useState(0);
  const [offT, setOffT] = useState(0);
  const [A, setA] = useState(0);

  const onChangeAnswers = (e) => {
    e.preventDefault();
    if (e.target.name === "why" && e.target.value !== "other") {
      setWhy("");
    }
    if (e.target.name === "outageTimes" && e.target.value !== "other") {
      setOutageTimes("");
    }
    if (e.target.name === "outageTimeLength" && e.target.value !== "other") {
      setOutageTimeLength(null);
    }
    if (e.target.name === "howMuchCosts" && e.target.value === "soum") {
      setKw(null);
    }
    if (e.target.name === "howMuchCosts" && e.target.value === "kw") {
      setSoum(null);
    }
    setAnswers((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    const calculate = () => {
      answers.where === "home" && setQ(295); // q - это цена, для дома это 295, для предприятия 450
      answers.where === "company" && setQ(450);

      if (Q) {
        setY(Math.ceil(soum / Q / 30 / 12.8 / 0.8));
      } else if (Q === null) {
        setY(Math.ceil(soum / 30 / 12.8 / 0.8));
      }

      if (answers.why === "manyPowerOutages" && soum && Q) {
        // Теперь нужно определить сколько нужно аккумуляторов
        setF(Math.ceil(soum / Q / 30 / 24));
      } else if (answers.why === "manyPowerOutages" && soum && Q === null) {
        setF(Math.ceil(soum / 30 / 24));
      }

      if (answers.outageTimeLength === "other" && F && outageTimeLength) {
        // F умножается на ответ из четвертого вопроса
        setT(Math.ceil(F * outageTimeLength));
      } else if (answers.outageTimeLength !== null && F) {
        setT(Math.ceil(F * answers.outageTimeLength));
      }
    };
    calculate();
  }, [answers, why, outageTimes, outageTimeLength, soum, kw]);

  useEffect(() => {
    const ceiling = () => {
      if (T && Q && Y && F && T) {
        while (T % 5 !== 0) {
          setT((prev) => prev + 1);
          if (T % 5 !== 0) break;
        }
      }
    };
    ceiling();
  }, [F, answers.outageTimeLength, outageTimeLength, T]);

  useEffect(() => {
    const getCost = () => {
      if (Y <= 10) {
        setHybird(Y * 13000000);
        setOngrid(Y * 12000000);
        setOffgrid(Y * 12000000);
      } else if (Y > 10 && Y <= 50) {
        setHybird(Y * 12500000);
        setOngrid(Y * 11500000);
        setOffgrid(Y * 11000000);
      } else if (Y > 50) {
        setHybird(Y * 12000000);
        setOngrid(Y * 11000000);
        setOffgrid(Y * 11000000);
      }

      if (T > 5) {
        setOffT(T * 6100000);
      } else if (T === 5) setOffT(36000000);
    };
    getCost();
  }, [Y, T]);

  console.log("hybird", hybird);
  console.log("ongrid", ongrid);
  console.log("offgrid", offgrid);
  console.log("offT", offT);

  console.log("soum", soum);

  console.log("F: аккумуляторов", F);
  console.log("T", T);
  console.log("Y", Y);

  return (
    <div className="app grid grid-cols-12 grid-rows-8">
      <header className="header flex items-center border-b border-gray-300 col-span-12 row-span-1 drop-shadow-2xl">
        <Title className="h-full flex items-center justify-center !m-0 min-w-[100px] border-b-[3px] border-blue-800">
          UUA
        </Title>
        <div className="flex h-full">
          <Text className="h-full flex items-center justify-center border-b-[3px] border-blue-800 min-w-[80px] pr-3 pl-10">
            01. Where
          </Text>
          <Text className="h-full flex items-center justify-center border-b-[3px] border-blue-800 min-w-[80px] px-3">
            02. Why
          </Text>
          <Text className="h-full flex items-center justify-center border-b-[3px] border-blue-800 min-w-[80px] px-3">
            03. Outage times
          </Text>
          <Text className="h-full flex items-center justify-center border-b-[3px] border-blue-800 min-w-[80px] px-3">
            04. Outage time length
          </Text>
          <Text className="h-full flex items-center justify-center border-b-[3px] border-blue-800 min-w-[80px] px-3">
            05. How much cost
          </Text>
        </div>
      </header>
      <div className="flex flex-col justify-start items-center py-6 max-h-full overflow-y-auto overflow-x-hidden scroll bg-[#bdbdbd21] col-span-9 row-start-2 row-span-full">
        <div className="my-4 w-[500px] max-w-3xl">
          <Title level={3}>Куда вы хотите поставить солнечные панели?</Title>
          <Radio.Group
            onChange={onChangeAnswers}
            name="where"
            value={answers.where}>
            <Space direction="vertical">
              <Radio name="where" value={"home"}>
                Домой
              </Radio>
              <Radio name="where" value={"company"}>
                Предприятие
              </Radio>
            </Space>
          </Radio.Group>
        </div>
        <div className="my-4 w-[500px] max-w-3xl">
          <Title level={3}>Для чего вы хотите поставить?</Title>
          <Radio.Group
            onChange={onChangeAnswers}
            name="why"
            value={answers.why}>
            <Space direction="vertical">
              <Radio name="why" value={"manyPowerOutages"}>
                Из-за проблем со электроэнергией, много отключают электроэнергию
              </Radio>
              <Radio name="why" value={"forInvestment"}>
                Для инвестиции
              </Radio>
              <Radio name="why" value={"other"}>
                Свой ответ
              </Radio>
              {answers.why === "other" && (
                <Input
                  className="min-w-[100px] max-w-full"
                  onChange={(e) => setWhy(e.target.value)}
                  value={why}
                />
              )}
            </Space>
          </Radio.Group>
        </div>

        <div className="my-4 w-[500px] max-w-3xl">
          <Title level={3}>
            В какое время в днем или ночью у вас отключают электроэнергию, и на
            сколько часов?
          </Title>
          <Radio.Group
            onChange={onChangeAnswers}
            name="outageTimes"
            value={answers.outageTimes}>
            <Space direction="vertical">
              <Radio name="outageTimes" value={"day"}>
                Днем
              </Radio>
              <Radio name="outageTimes" value={"night"}>
                Ночью
              </Radio>
              <Radio name="outageTimes" value={"other"}>
                Свой ответ
              </Radio>
              {answers.outageTimes === "other" && (
                <Input
                  onChange={(e) => setOutageTimes(e.target.value)}
                  value={outageTimes}
                  className="min-w-[100px] max-w-full"
                />
              )}
            </Space>
          </Radio.Group>
        </div>

        <div className="my-4 w-[500px] max-w-3xl">
          <Title level={3}>
            На сколько часов у вас отключают электроэнергию среднем в день?
          </Title>
          <Radio.Group
            onChange={onChangeAnswers}
            name="outageTimeLength"
            value={answers.outageTimeLength}>
            <Space direction="vertical">
              <Radio name="outageTimeLength" value={2}>
                2 часа
              </Radio>
              <Radio name="outageTimeLength" value={4}>
                4 часа
              </Radio>
              <Radio name="outageTimeLength" value={6}>
                6 часов
              </Radio>
              <Radio name="outageTimeLength" value={"other"}>
                Свой ответ
              </Radio>
              {answers.outageTimeLength === "other" && (
                <Input
                  onChange={(e) => setOutageTimeLength(e.target.value)}
                  value={outageTimeLength}
                  className="min-w-[100px] max-w-full"
                />
              )}
            </Space>
          </Radio.Group>
        </div>

        <div className="my-4 w-[500px] max-w-3xl">
          <Title level={3}>
            Сколько вы платите, либо потребляете электроэнергию в среднем за
            один месяц?
          </Title>
          <Radio.Group
            onChange={onChangeAnswers}
            name="howMuchCosts"
            value={answers.howMuchCosts}>
            <Space direction="vertical">
              <Radio name="howMuchCosts" value={"soum"}>
                Сум
              </Radio>
              <Radio name="howMuchCosts" value={"kw"}>
                кВт
              </Radio>
              {answers.howMuchCosts === "soum" && (
                <Input
                  type="number"
                  onChange={(e) => setSoum(e.target.value)}
                  value={soum}
                  placeholder={"Сколько?"}
                  className="min-w-[100px] max-w-full"
                />
              )}
              {answers.howMuchCosts === "kw" && (
                <Input
                  type="number"
                  onChange={(e) => setKw(e.target.value)}
                  value={kw}
                  placeholder={"кВт?"}
                  className="min-w-[100px] max-w-full"
                />
              )}
            </Space>
          </Radio.Group>
        </div>
      </div>
      <footer className="flex flex-col justify-start items-center col-span-3 row-start-2 row-span-full drop-shadow-2xl">
        <Space wrap className="m-2 mt-4 ">
          <Progress type="circle" percent={100} />
        </Space>
        <div className="w-[95%] flex flex-col gap-1">
          <p className="m-0 py-3">Цена за солнечные панели</p>
          <div className="flex flex-wrap justify-evenly bg-[#0000ff26] p-4 rounded-[4px]">
            <p className="m-0 text-base">Гибрид</p>
            <p className="m-0 text-lg font-semibold">{hybird + T}</p>
          </div>
          <div className="flex flex-wrap justify-evenly bg-[#0000ff26] p-4 rounded-[4px]">
            <p className="m-0 text-base">On grid</p>
            <p className="m-0 text-lg font-semibold">{ongrid + T}</p>
          </div>
          <div className="flex flex-wrap justify-evenly bg-[#0000ff26] p-4 rounded-[4px]">
            <p className="m-0 text-base">Off grid</p>
            <p className="m-0 text-lg font-semibold">{offgrid + T}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
