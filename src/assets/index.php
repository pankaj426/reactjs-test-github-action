<?php 
// create a new cURL resource
$service_url = 'http://18.235.246.81:3000/api/v1/use_cases_solutions/details/'.$_GET['uc_id'];
$curl = curl_init($service_url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
$curl_response = curl_exec($curl);
if ($curl_response === false) {
    $info = curl_getinfo($curl);
    curl_close($curl);
    die('error occured during curl exec. Additioanl info: ' . var_export($info));
}
curl_close($curl);
$decoded = json_decode($curl_response);
?>
<!DOCTYPE html>
<html>
   <head>
      <meta charset='utf-8'>
      <title><?php echo $decoded->body->title?></title>
      <link rel="icon" href="<?php echo $decoded->body->portal_url.'/assets/images/favicon.ico';?>" type="image/x-icon">
      <meta property='og:title' content='<?php echo $decoded->body->title?>'>
      <meta property='og:description' content='<?php echo $decoded->body->short_description?>'> 
      <meta property='og:url' content='<?php echo $decoded->body->portal_url?>assets/index.php?uc_id=<?php echo $_GET['uc_id']?>&embed=false'>
      <meta property='og:image' content='<?php echo $decoded->body->api_url.'/upload/'.$_GET['uc_id'].'.png?a='.time()?>'>
      <meta name='viewport' content='width=device-width, initial-scale=1'>
      <link href='https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap' rel='stylesheet'>
      <style type='text/css'> *, :after, :before{-webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box}body{background: #f4f7fc url(http://18.235.246.81/assets/images/background.png) no-repeat 0 0; background-size: auto; font-family: 'Poppins', sans-serif;}.apply-white-box{max-width: 943px; margin: 0 auto; padding: 0; background: #f6f5f7; position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); -webkit-transform: translate(-50%,-50%); max-height: 418px; box-shadow: 0 8px 15px rgba(0,50,101,.09); border-radius: 8px; width: 100%; display: flex;}.display-flex{display: flex;}.apply-company-img{padding: 80px 50px; text-align: left; background: #003265; letter-spacing: 0px; color: #FFFFFF; font-weight: 600; font-family: 'Poppins', sans-serif; font-size: 24px; width: 42%; border-radius: 8px 0 0 8px;}.apply-box-content{padding: 55px 36px; background: #fff; border-radius: 0 8px 8px 0 ; overflow: hidden; width: 68%;}.apply-box-heading{letter-spacing: 0; color: #003265; font-size: 22px; font-weight: 600; line-height: 24px;}.by-user-name{color: rgba(0,0,0,.64); margin-bottom: 20px; font-size: 9px; font-weight: 400; display: flex;}.by-user-name span{color: #ff5242; display: inline-block; margin-left: 0; font-weight: 400; font-size: 8px; vertical-align: middle; padding-left: 3px;}.publish-time{color: rgba(0,0,0,.64); font-size: 9px; font-weight: 400; margin-left: auto;}.red-btn{padding: 8px 25px; font-weight: 500; background: #ff5242 !important; border-radius: 4px; font-family: Poppins,sans-serif; border: none; width: 100%; float: none; font-size: 16px !important; color: #fff; cursor: pointer; height: auto; text-decoration: none; display: inline-block; text-align: center;}.red-btn:hover, .red-btn:focus{outline: none;}.apply-short-desc{letter-spacing: 0; color: rgba(0,0,0,.5); font-size: 14px; font-weight: 400; padding: 20px 0;}.ml-auto{margin-left: auto;}.w-60{width: 60%;}.align-center{align-items: center;}.txf-logo img{max-width: 52px;}@media(max-width: 991px){.apply-box-content{padding: 25px 36px;}.apply-company-img{font-size: 20px;}.apply-box-heading img{max-height: 42px;}.apply-white-box{max-width: 95%;}}@media(max-width: 850px){.apply-company-img{padding: 80px 25px;}.apply-box-heading{font-size: 20px;}}@media(max-width: 767px){.apply-company-img{font-size: 16px;}.apply-short-desc{padding: 0 0; max-height: 150px; overflow-y: auto; margin: 15px 0;}}@media(max-width: 600px){.apply-white-box{display: block; position: inherit; transform: inherit; left: inherit; top: inherit; margin-top: 20px;}.apply-company-img{width: 100%; border-radius: 8px 8px 0 0; padding: 40px 25px; text-align: center;}.apply-box-content{width: 100%; border-radius: 0 0 8px 8px;}}</style>
   </head>
   <body>
      <div class='white-box apply-white-box'>
         <div class='apply-company-img'><?php echo $decoded->body->title?></div>
         <div class='apply-box-content'>
            <div class='apply-box-heading display-flex align-center'>
               <div>Discover Demand</div>
               <div class='ml-auto'> <?php echo $decoded->body->org_details?> </div>
            </div>
            <div class='apply-short-desc'><?php echo $decoded->body->short_description?></div>
            <div class='display-flex align-center'>
               <div class='w-60'> <a href="<?php echo $decoded->body->portal_url?>authentication/startup-application-form/<?php echo $_GET['uc_id']?>" target='_blank' class='red-btn minw-210'>Apply</a> </div>
               <div class='ml-auto txf-logo'> <img src='<?php echo $decoded->body->portal_url?>assets/images/company-logo.svg'> </div>
            </div>
         </div>
      </div>
   </body>
</html>