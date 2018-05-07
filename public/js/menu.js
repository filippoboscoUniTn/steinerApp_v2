function myfunc2(a,ulsNumb){

    var parentUliD = a.parentNode.parentNode.id.split(/_/);
    if(parentUliD[2] !== 'hiddenUl'){
        while(ulsNumb!==0)
        {
            var hUlId = 'ul_' + parentUliD[1]+'_' + 'hiddenUl_' + ulsNumb;
            var hiddenUl = document.getElementById(hUlId);
            var hiddenUlName = hiddenUl.className.split(" ")[2];
            if(hiddenUlName !== 'myVisible')
            {
                hiddenUl.setAttribute('class','nav nav-sidebar myVisible')
            }
            else
            {
                hiddenUl.setAttribute('class','nav nav-sidebar myHidden')
            }
            ulsNumb -= 1;
        }
    }
    else if(parentUliD[2] === 'hiddenUl')
    {
        while(ulsNumb !== 0)
        {
            var subUlId = 'ul_' + parentUliD[1] + '_' + 'hiddenUl_' + parentUliD[3] + '_subUl_' + ulsNumb
            var subUl = document.getElementById(subUlId);
            var subUlName = subUl.className.split(" ")[1];
            if(subUlName === 'myHidden')
            {

                // subUl.setAttribute('class','nav nav-sidebar myVisible')
                subUl.setAttribute('class','nav subNav')
            }
            else
            {
                //subUl.setAttribute('class','nav nav-sidebar myHidden')
                subUl.setAttribute('class','nav-sidebar myHidden')
            }
            ulsNumb -= 1;
        }
    }
}