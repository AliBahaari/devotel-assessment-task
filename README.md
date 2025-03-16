# Devotel Assessment Task

I have implemented this project as an assessment task for a company based in the USA.

## Installation

First, clone the project:

```bash
git clone https://github.com/AliBahaari/devotel-assessment-task.git
```

Then, install the packages using _npm_:

```bash
cd devotel-assessment-task
npm i
```

After that, run the project:

```bash
npm run dev
```

## API Usage

In the project, I've implemented 4 different endpoints. 3 of them are as well as other endpoints, easy-peasy! 1 of them needs to be described!
You can find the related file in this directory: **/src/apis/GetDynamicData**
As you can see, _Method_, _Endpoint_, _Query Param_ are dynamic and the _TanStack Query_ hook I've written for handling this kind of operations, covers this.

```javascript
export function useGetDynamicData({
  allowed,
  dependsOn,
  endpoint,
  method,
  value,
}: GetDynamicDataProps) {
  return useQuery({
    queryKey: [TQ_QUERIES.GET_DYNAMIC_DATA, value],
    queryFn: async () => {
      const { data } = await axiosInstance({
        url: `${endpoint}?${dependsOn}=${value}`,
        method,
      });
      return data;
    },
    enabled: allowed && !!value,
  });
}
```

## Demo

Check the project out here:
[Demo](https://devotel-assessment-task.vercel.app)

## Contributing

Notice, this project contains _Husky_, _Lint Staged_, _ESLint_, _Prettier_, _CommitLint_, etc.
So, take it easy to contribute safely!
