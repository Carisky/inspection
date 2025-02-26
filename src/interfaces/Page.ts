interface Page {
  data: {
    url: string;
    title: string;
    children?: [{
      url?:string,
      title?:string,
    }];
  };
}

export default Page;
