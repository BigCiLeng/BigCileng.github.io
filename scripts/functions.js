/*
 * @Author: BigCiLeng && bigcileng@outlook.com
 * @Date: 2024-01-07 13:58:54
 * @LastEditors: BigCiLeng && bigcileng@outlook.com
 * @LastEditTime: 2024-01-07 13:58:58
 * @FilePath: \BigCileng.github.io\scripts\functions.js
 * @Description: 
 * 
 * Copyright (c) 2023 by bigcileng@outlook.com, All Rights Reserved. 
 */
function toggleblock(blockId)
{
   var block = document.getElementById(blockId);
   if (block.style.display == 'none') {
    block.style.display = 'block' ;
   } else {
    block.style.display = 'none' ;
   }
}

function hideblock(blockId)
{
   var block = document.getElementById(blockId);
   block.style.display = 'none' ;
}