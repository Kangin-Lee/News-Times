let news = [];
let menus = document.querySelectorAll(".menus button");
let searchBtn = document.getElementById("search-btn");
let searchInput = document.getElementById("search-input");
let searchGlass = document.getElementById("search-glass");
let url;
let page = 1;
let totalPages = 0; 

searchGlass.addEventListener("click",()=>{
    searchBtn.classList.toggle("active");
    searchInput.classList.toggle("active");
});

searchInput.addEventListener("keypress", function(event){
    if(event.key == "Enter"){
        event.preventDefault();
        searchBtn.click();
    }
});

menus.forEach(menu => menu.addEventListener("click",(event)=>getNewsByTopic(event)));


const getNews= async()=>{
    try{
        let header = new Headers({'x-api-key':'tz_LEJcVvFWmdFWsU_eF0Hvl4vZfnZddnoCxUNUpvDw'});

        url.searchParams.set("page",page);
        let response = await fetch(url,{headers:header});
        let data = await response.json();

        if(response.status == 200){
            console.log("받은 데이터는",data);
            if(data.total_hits == 0){
                throw new Error("검색된 결과가 없습니다.");
            }
            console.log("data는",data);
            news = data.articles;
            page = data.page;
            totalPages = data.total_pages;
            console.log(news);
        
            render();
            pageNation();
        }else{
            console.log("data",data.message);
            throw new Error(data.message);
            
        }
       
    }catch(error){
        console.log("잡힌 에러는",error.message);
        errorRender(error.message);
    }
    
}

const getLatestNews = async () =>{
    url = new URL(
        `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=business&page_size=10`
    );
    getNews();
}

const getNewsByTopic = async(event) =>{
    let topic = event.target.textContent.toLowerCase();

    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`);
    getNews();
}

const getNewsByKeyword = async()=>{
    let keyword = searchInput.value;
    url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`);
    getNews();
}

const render = ()=>{
    let newsHTML = "";
    newsHTML = news.map((item)=>{
        return `<div class="row news-contents">
        <div class="col-lg-4 news-img">
            <img  class ="img-size" src="${item.media}" alt="">
        </div>
        <div class="col-lg-8">
            <h2>${item.title}</h2>
            <p>${item.summary}</p>
            <div>${item.rights} * ${item.published_date} * ${item.author}</div>
        </div>
    </div>`
    }).join("");

    document.getElementById("news-board").innerHTML = newsHTML;
}

const errorRender=(message)=>{
    let errorHTML = `<div class="alert alert-danger text-center" role="alert">
    ${message}
  </div>`
    document.getElementById("news-board").innerHTML = errorHTML;
}

const pageNation=()=>{
    let pageNationHTML = ``;
    let pageGroup = Math.ceil(page/5);

    let last = pageGroup * 5;
    if(last >= totalPages){
        last = totalPages;
    }
    let first = last-4 <= 0?1:last-4;

    if(pageGroup != 1){
        pageNationHTML =`<li class="page-item">
        <a class="page-link" href="#" aria-label="Previous" onclick=moveToPage(1)>
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li class="page-item">
        <a class="page-link" href="#" aria-label="Previous" onclick=moveToPage(${page-1})>
          <span aria-hidden="true">&lt;</span>
        </a>
      </li>`
    }
    
    for(let i = first; i <= last; i++){
        pageNationHTML+=`<li class="page-item ${page == i?"active":""}"><a class="page-link" onclick=moveToPage(${i}) href="#">${i}</a></li>`
    }
    
    if(page != totalPages){
        pageNationHTML +=`<li class="page-item">
        <a class="page-link" href="#" aria-label="Next" onclick=moveToPage(${page+1})>
          <span aria-hidden="true">&gt;</span>
        </a>
      </li>
      <li class="page-item">
          <a class="page-link" href="#" aria-label="Next" onclick=moveToPage(${totalPages})>
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>`
    }
    console.log("pageGroup",pageGroup);
    
    document.querySelector(".pagination").innerHTML = pageNationHTML;
}

const moveToPage=(pageNum)=>{
    page = pageNum;
    console.log(page);
    getNews();
}
searchBtn.addEventListener("click", ()=>getNewsByKeyword());
getLatestNews();