import Banner from "../components/Banner";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import Jobs from "../pages/Jobs"
import Sidebar from "../sidebar/Sidebar";

const Home = ()=>{
    const [selectedCategory,setSelectedCategory] = useState(null);
    const [jobs,setJobs]=useState([]);
    const [isLoading,setIsLoading] = useState(true);
    const [currentPage,setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    useEffect(()=>{
        setIsLoading(true);
        fetch('jobs.json',{headers :{'Content-Type' : 'application/json','Accept':'application/json'}}).then(res=>res.json()).then(data=>{
        
            setJobs(data);
            setIsLoading(false);
        })
        const timeout = setTimeout(() => {
            <div class="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
  <div class="animate-pulse flex space-x-4">
    <div class="rounded-full bg-slate-200 h-10 w-10"></div>
    <div class="flex-1 space-y-6 py-1">
      <div class="h-2 bg-slate-200 rounded"></div>
      <div class="space-y-3">
        <div class="grid grid-cols-3 gap-4">
          <div class="h-2 bg-slate-200 rounded col-span-2"></div>
          <div class="h-2 bg-slate-200 rounded col-span-1"></div>
        </div>
        <div class="h-2 bg-slate-200 rounded"></div>
      </div>
    </div>
  </div>
</div>
            
        }, 3000);

    },[])
     //console.log(jobs)

    const [query,setQuery] = useState("");
    const handleInputChange=(e)=>{
        setQuery(e.target.value)
    }

    //filter jobs by title

    const filteredItems = jobs.filter((job)=>job.jobTitle.toLowerCase().indexOf(query.toLowerCase())!==-1)

    // Radio filtering
    const handleChange = (e)=>{
        setSelectedCategory(e.target.value)
    }

    // button based filtering
    const handleClick = (e)=>{

        setSelectedCategory(e.target.value)
    }
   // calculate the index range
    const calculatePageRange = ()=>{
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return {startIndex,endIndex}
    }

    // function for the next page
    const nextPage = () =>{
        if(currentPage < Math.ceil(filteredItems.length / itemsPerPage)){
            setCurrentPage(currentPage + 1)
        }
    }
    // function for previous page
    const prevPage = () =>{
        if(currentPage > 1){
            setCurrentPage(currentPage - 1)
        }
    }
    //main function
    const filteredData = (jobs,selected,query)=>{
        let filteredJobs = jobs;
        
        // filtering input items 
        if(query){
            filteredJobs=filteredJobs.filter(job=>{
                return job.jobTitle.toLowerCase().includes(query.toLowerCase()) || 
                   job.description.toLowerCase().includes(query.toLowerCase());

            })
        }

        // category filtering
        if(selected){
            const currentDate = new Date().toISOString().slice(0,10);
            filteredJobs = filteredJobs.filter(({jobLocation,maxPrice,experienceLevel,salaryType,employmentType,postingDate})=>{
                return jobLocation.toLowerCase() === selected.toLowerCase() || 
                       parseInt(maxPrice) === parseInt(selected) ||
                       (selected && new Date(postingDate)>=new Date(selected))||
                       salaryType.toLowerCase() === selected.toLowerCase() ||
                       experienceLevel.toLowerCase() === selected.toLowerCase()||
                       employmentType.toLowerCase() === selected.toLowerCase()
            });
            console.log(filteredData);
        }
        // slice the data based on current page
        const {startIndex,endIndex}= calculatePageRange();
        filteredJobs = filteredJobs.slice(startIndex,endIndex)
        return filteredJobs.map((data,i)=><Card key={i} data={data}/>)
    }

    const result = filteredData(jobs,selectedCategory,query);


    return(
        <>
        <div>
        <Banner query={query} handleInputChange={handleInputChange}/>
        </div>
        {/* main content */}
        <div className="bg-[#FAFAFA] md:grid grid-cols-4 gap-8 lg:px-24 px-4 py-12">
            {/* left side */}
            <div className="bg-white p-4 rounded">
                <Sidebar handleChange={handleChange} handleClick={handleClick}/>
            </div>
            {/* job cards */}
            <div className="col-span-2 bg-white p-4 rounded-sm">
                {
                    isLoading ? (<div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
                        <div className="animate-pulse flex space-x-4">
                          <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                          <div className="flex-1 space-y-6 py-1">
                            <div className="h-2 bg-slate-200 rounded"></div>
                            <div className="space-y-3">
                              <div className="grid grid-cols-3 gap-4">
                                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                              </div>
                              <div className="h-2 bg-slate-200 rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>): result.length > 0 ? (<Jobs result={result}/>):<>
                    <h3 className="text-lg font-bold mb-2">{result.length} Jobs</h3>
                    <p>No Data Found</p></>

                }
                {/* pagination here  */}
                {
                    result.length > 0 ? (
                        <div className="flex justify-center mt-4 space-x-8">
                          <button onClick={prevPage} disabled={currentPage === 1} className="hover:underline">Previous</button>
                          <span className="mx-2">Page {currentPage} of {Math.ceil(filteredItems.length / itemsPerPage)}</span>
                          <button onClick={nextPage} disabled={currentPage === Math.ceil(filteredItems.length /  itemsPerPage)} className="hover:underline" >Next</button>
                        </div>
                    ):""
                }
            </div>
                
        </div>
        
        </>
    )
}
export default Home;