import { useQuery } from "@tanstack/react-query";

const href = "https://github.com/exhibitionist-digital/ultra";

export default function GitHub() {
  const stars = useQuery(["stars"], async () => {
    return await fetch(
      `/api/github`,
    ).then((response) => response.json());
  });

  return (
    <a id="github" href={href} target="_blank">
      ★ <span>{stars?.data?.stargazers_count}</span>
    </a>
  );
}