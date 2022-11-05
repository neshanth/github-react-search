import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setGithubRepos] = useState(mockRepos);
  const [followers, setGithubFollowers] = useState(mockFollowers);
  const [requests, setRequests] = useState(0);
  const [error, setError] = useState({ show: false, msg: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then((response) => {
        const { data } = response;
        let {
          rate: { remaining },
        } = data;

        setRequests(remaining);
        if (remaining === 0) {
          showError(true, "You have exceeded rate limit");
        }
      })
      .catch((err) => console.log(err));
  };

  const searchGithubUser = async (user) => {
    showError();
    setIsLoading(true);
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) => console.log(err));
    if (response) {
      setGithubUser(response.data);
      const { login, followers_url } = response.data;
      await Promise.allSettled([axios(`${rootUrl}/users/${login}/repos?per_page=100`), axios(`${followers_url}?per_page=100`)]).then((response) => {
        const [repos, followers] = response;
        let status = "fulfilled";
        if (repos.status === status) {
          setGithubRepos(repos.value.data);
        }
        if (followers.status === status) {
          setGithubFollowers(followers.value.data);
        }
      });
    } else {
      showError(true, "No user found with that name");
    }
    handleRequests();
    setIsLoading(false);
  };

  const showError = (show = false, msg = "") => {
    setError({ show, msg });
  };

  useEffect(handleRequests, []);

  return <GithubContext.Provider value={{ githubUser, repos, followers, requests, error, searchGithubUser, isLoading }}>{children}</GithubContext.Provider>;
};

export { GithubContext, GithubProvider };
