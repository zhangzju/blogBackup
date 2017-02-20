## 邮箱服务器的选择

在gitlab官方的安装包及安装教程中，推荐使用postfix作为邮件发送单位，支持smtp等基本协议，为此也提供了邮件通知这个基本的功能。

作为一个rails应用，gitlab本身也遵循rails的一些共有约定，包括Action Mailer。所以我们在配置gitlab的时候，只需要配置rails即可。

## 配置

如果使用内网的smtp服务器的话，在配置之前需要先测试一下smtp服务器的连通性：

```shell
 nmap <HO替换成ST> -P <POST>
```
nmap显示端口是可用的之后，就可以放心的进行配置了。

gitlab的配置文件是 __/etc/gitlab/gitlab.rb__ ，我们需要修改smtp相关的一些参数。但是在这之前，千千万万要注意的是，所有运维工程师都会
犯下的一个错误：备份。

等我们备份好了源文件之后，开始修改gitlab.rb,如下：

```ruby

gitlab_rails['smtp_enable'] = true
gitlab_rails['smtp_address'] = "smtp.server"
gitlab_rails['smtp_port'] = 465
gitlab_rails['smtp_user_name'] = "smtp user"
gitlab_rails['smtp_password'] = "smtp password"
gitlab_rails['smtp_domain'] = "example.com"
gitlab_rails['smtp_authentication'] = "login"
gitlab_rails['smtp_enable_starttls_auto'] = true
gitlab_rails['smtp_openssl_verify_mode'] = 'peer'

# 如果你使用的SMTP服务是默认的 'From:gitlab@localhost'
# 你可以修改这里的 'From' 的值。
gitlab_rails['gitlab_email_from'] = 'gitlab@example.com'
gitlab_rails['gitlab_email_reply_to'] = 'noreply@example.com'

```
上面的配置适用于内网中的服务器，对于外网的服务器，配置也差不多，关键就是配置之前先测试。

## 验证

gitlab作为一个rails应用，也提供了运行bundle任务的接口，
首先：
```ruby
 Notify.test_email('destination_email@address.com', 'Message Subject', 'Message Body').deliver_now
```

记得把目标账户和内容替换成你自己的内容。如果能够收到邮件，说明gitlab服务器方面就没什么问题了。