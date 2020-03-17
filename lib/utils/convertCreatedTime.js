import differenceInDays from "date-fns/differenceInDays";

const convertCreatedTime = stock_at => {
  if (!stock_at) {
    return null;
  }

  try {
    const prevDate = new Date(stock_at);
    const currentDate = new Date();
    const diffDays = differenceInDays(currentDate, prevDate);

    const timeString = stock_at.split(" ")[1];
    const timeWithSecond = timeString.substring(
      0,
      timeString.lastIndexOf(":") + 1
    );

    if (currentDate.getDate() === prevDate.getDate()) {
      return `오늘 ${timeWithSecond} 입고`;
    }

    return `${diffDays === 0 ? 1 : diffDays}일 전 입고`;
  } catch (error) {
    return null;
  }
};

export default convertCreatedTime;
